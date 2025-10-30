import os
import re
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import warnings

# --- Firebase Admin SDK Imports ---
import firebase_admin
from firebase_admin import credentials, firestore

# --- Sentence-Transformers, Scikit-learn, and Fairlearn ---
from sentence_transformers import SentenceTransformer, util
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from fairlearn.metrics import MetricFrame, demographic_parity_ratio, equalized_odds_ratio
from fairlearn.postprocessing import ThresholdOptimizer

# Suppress scikit-learn warnings that can be verbose
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)

# --- Configuration (Must match your data paths and model names) ---
SBERT_MODEL_NAME = 'all-MiniLM-L6-v2'
GOOD_MATCH_THRESHOLD = 4  # Threshold for original match_score to be a "good match"
DATA_FILE_PATH = "./data/resume_job_match_with_gender.csv"
FIREBASE_ADMIN_SDK_PATH = "./backend/firebase-admin-sdk.json"

# --- FastAPI App Setup ---
app = FastAPI(
    title="AI Recruitment Tool API",
    description="API for semantic resume-job matching with bias detection.",
    version="1.0.0"
)

# --- CORS Middleware ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Variables for Models and Data (Loaded once on startup) ---
model_sbert = None
logistic_model_baseline = None
df_full = None
simulated_genders = None
db_firestore = None

# --- Pydantic Models for API ---
class MatchRequest(BaseModel):
    job_description: str
    resume: str

class MatchResponse(BaseModel):
    bert_similarity_score: float
    is_good_match: bool
    message: str
    candidate_id: str
    candidate_name: str
    candidate_department: str
    bias_insight_message: str
    fairness_metrics_overall: Dict[str, float]
    fairness_metrics_by_group: Dict[str, Dict[str, float]]

class ShortlistCandidateRequest(BaseModel):
    candidate_id: str
    candidate_name: str
    candidate_department: str
    match_score: float
    shortlisted_status: bool
    simulated_gender: str

class ShortlistedCandidate(ShortlistCandidateRequest):
    id: str
    shortlisted_at: float

# --- Helper Functions ---
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'[^a-z0-9\s.,;\'"!?]', '', text)
    return text

def get_bert_similarity(text1, text2):
    embeddings = model_sbert.encode([text1, text2])
    embedding1 = embeddings[0].reshape(1, -1)
    embedding2 = embeddings[1].reshape(1, -1)
    similarity = cosine_similarity(embedding1, embedding2)[0][0]
    return float(similarity)

# --- Startup Event: Load Models and Data ---
@app.on_event("startup")
async def startup_event():
    global model_sbert, logistic_model_baseline, df_full, simulated_genders, db_firestore

    print("Loading Sentence-BERT model...")
    try:
        model_sbert = SentenceTransformer(SBERT_MODEL_NAME)
        print("Sentence-BERT model loaded to CPU.")
    except Exception as e:
        print(f"Error loading Sentence-BERT model: {e}")
        model_sbert = None

    print("Loading and preparing data for training/evaluation...")
    try:
        if not os.path.exists(DATA_FILE_PATH):
            raise FileNotFoundError(f"Data file not found: {DATA_FILE_PATH}")
        df_full = pd.read_csv(DATA_FILE_PATH)
        df_full['is_good_match'] = (df_full['match_score'] >= GOOD_MATCH_THRESHOLD).astype(int)
        
        X = df_full['bert_similarity_score'].values.reshape(-1, 1)
        y = df_full['is_good_match']
        simulated_genders = df_full['simulated_gender']
        
        print("Training baseline Logistic Regression model for API...")
        logistic_model_baseline = LogisticRegression(solver='liblinear', random_state=42)
        logistic_model_baseline.fit(X, y)
        print("Logistic Regression model trained.")

    except FileNotFoundError:
        print(f"Error loading data or training Logistic Regression model: Data file not found: {DATA_FILE_PATH}")
        logistic_model_baseline = None
        df_full = None
    except Exception as e:
        print(f"An unexpected error occurred during model and data loading: {e}")
        logistic_model_baseline = None
        df_full = None

    # --- Firebase Admin SDK Initialization ---
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(FIREBASE_ADMIN_SDK_PATH)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK and Firestore initialized successfully.")
        db_firestore = firestore.client()
    except FileNotFoundError:
        print(f"ERROR: Firebase Admin SDK key not found at {FIREBASE_ADMIN_SDK_PATH}. Firestore functionality will be disabled.")
        db_firestore = None
    except Exception as e:
        print(f"An unexpected error occurred during Firebase initialization: {e}")
        db_firestore = None

# --- API Endpoints ---
@app.post("/match", response_model=MatchResponse)
async def match_resume_and_job(request: MatchRequest):
    if logistic_model_baseline is None or df_full is None or model_sbert is None:
        raise HTTPException(status_code=503, detail="AI models or data not loaded. Server is starting up.")

    # 1. Generate BERT embeddings and calculate similarity
    bert_similarity_score = get_bert_similarity(
        clean_text(request.job_description), 
        clean_text(request.resume)
    )

    # 2. Predict shortlisting status
    prediction_input = np.array([[bert_similarity_score]])
    is_good_match = bool(logistic_model_baseline.predict(prediction_input)[0])
    message = "Candidate is a good match for shortlisting!" if is_good_match else "Candidate is not a good match for shortlisting."

    # 3. Calculate fairness metrics
    y_true_full = df_full['is_good_match']
    y_pred_full = logistic_model_baseline.predict(df_full['bert_similarity_score'].values.reshape(-1, 1))
    
    overall_fairness = {
        "demographic_parity_ratio": demographic_parity_ratio(y_true_full, y_pred_full, sensitive_features=simulated_genders.tolist()),
        "equalized_odds_ratio": equalized_odds_ratio(y_true_full, y_pred_full, sensitive_features=simulated_genders.tolist())
    }

    metrics_by_group = MetricFrame(
        metrics={'accuracy': accuracy_score, 'recall': recall_score, 'precision': precision_score, 'f1': f1_score},
        y_true=y_true_full,
        y_pred=y_pred_full,
        sensitive_features=simulated_genders.tolist(),
    )
    
    metrics_by_group_dict = {
        str(group): {
            'accuracy': metrics_by_group.accuracy[group],
            'recall': metrics_by_group.recall[group],
            'precision': metrics_by_group.precision[group],
            'f1': metrics_by_group.f1[group]
        }
        for group in metrics_by_group.by_group.index
    }

    bias_insight_message = "Bias insights for the overall model are calculated based on the full dataset. Demographic Parity Ratio: {0:.3f}. Equalized Odds Ratio: {1:.3f}. Detailed per-group metrics are available.".format(
        overall_fairness['demographic_parity_ratio'],
        overall_fairness['equalized_odds_ratio']
    )
    
    # 4. Return the combined result
    return MatchResponse(
        bert_similarity_score=bert_similarity_score,
        is_good_match=is_good_match,
        message=message,
        candidate_id=f"temp_candidate_{np.random.randint(1000, 9999)}",
        candidate_name="N/A",
        candidate_department="Software",
        bias_insight_message=bias_insight_message,
        fairness_metrics_overall=overall_fairness,
        fairness_metrics_by_group=metrics_by_group_dict
    )

@app.post("/shortlist_candidate")
async def shortlist_candidate(request: ShortlistCandidateRequest):
    if db_firestore is None:
        raise HTTPException(status_code=503, detail="Firestore is not initialized. Check backend logs.")
    
    doc_ref = db_firestore.collection('shortlisted_candidates').document()
    candidate_data = request.dict()
    candidate_data['shortlisted_at'] = firestore.SERVER_TIMESTAMP
    
    await doc_ref.set(candidate_data)
    
    return {"message": "Candidate saved successfully to Firestore.", "id": doc_ref.id}

@app.get("/get_shortlisted_candidates", response_model=List[ShortlistedCandidate])
async def get_shortlisted_candidates():
    if db_firestore is None:
        raise HTTPException(status_code=503, detail="Firestore is not initialized. Check backend logs.")

    candidates_list = []
    candidates_stream = db_firestore.collection('shortlisted_candidates').stream()

    for doc in candidates_stream:
        candidate_data = doc.to_dict()
        candidate_data['id'] = doc.id
        if 'shortlisted_at' in candidate_data:
            candidate_data['shortlisted_at'] = candidate_data['shortlisted_at'].timestamp()
        
        candidates_list.append(ShortlistedCandidate(**candidate_data))
    
    return candidates_list