# AI-Recruitment-Tool

>full-stack AI tool for fairer candidate–job matching using semantic NLP and bias mitigation.

---

## 🌟 Overview

This project delivers an **AI-powered recruitment prototype** that goes beyond keyword matching by leveraging **Sentence-BERT (SBERT)** for semantic understanding. A core focus is the **measurement and mitigation of algorithmic bias** using **Fairlearn**, demonstrating how modern ML can be paired with responsible AI practices in a real web application.

The system includes:
- A **FastAPI** backend for embedding, scoring, screening, and bias-mitigation workflows
- A **React + Vite + Tailwind** frontend for recruiters
- **Firebase** for authentication (Google Sign-In) and **Firestore** for shortlisted candidates
- Notebooks to explore data, models, and evaluation

---

## ✨ Key Features

- **Semantic Resume–Job Matching** with **SBERT** embeddings and a **Logistic Regression** classifier for compatibility scoring.
- **Automated Resume Screening** to shortlist candidates for roles.
- **Bias Measurement** using **Fairlearn** (e.g., **Demographic Parity**, **Equalized Odds**) on a simulated sensitive attribute (gender).
- **Bias Mitigation** via **ThresholdOptimizer** (post-processing) to adjust decisions while preserving utility.
- **Shortlist & Review**: Persist shortlisted candidates to **Firestore** and review on the frontend **Analysis Page**.
- **Secure Access**: **Firebase Authentication** (Google Sign-In) for recruiter-only access.
- **Conceptual Interview Scheduling** flow for shortlisted candidates.

---

## 🧰 Tech Stack

- **Backend (Python 3.13)**: FastAPI, sentence-transformers (SBERT), scikit-learn, pandas, numpy, Fairlearn, Firebase Admin SDK
- **Frontend**: React, Vite, Tailwind CSS, Firebase JS SDK
- **Database**: Firebase **Firestore**
- **Auth**: Firebase Authentication (Google Sign-In)

---

