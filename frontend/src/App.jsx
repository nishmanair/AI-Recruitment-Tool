
import React, { useState, useEffect } from 'react';
import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import LoginPage from './LoginPage.jsx';
import AnalysisPage from './AnalysisPage.jsx'; // Import the new Analysis Page

// ===========================================
// Navbar Component
// ===========================================
const Navbar = ({ setCurrentPage, loggedInUser, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-green-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div className="text-white text-2xl font-bold tracking-wider cursor-pointer" onClick={() => setCurrentPage('home')}>
          AI-Recruit
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-200 hover:text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links and User Info (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <button onClick={() => setCurrentPage('home')} className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400">
            Home
          </button>
          <button onClick={() => setCurrentPage('matcher')} className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400">
            Matcher Page
          </button>
          <button onClick={() => setCurrentPage('analysis')} className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400">
            Analysis Page
          </button>
          {loggedInUser && (
            <div className="flex items-center text-white text-lg font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Welcome, {loggedInUser.displayName || loggedInUser.email || 'Recruiter'}!
              <button
                onClick={handleLogout}
                className="ml-4 text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Menu (collapsible) */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4 pb-3">
          <button onClick={() => { setCurrentPage('home'); toggleMenu(); }} className="block w-full text-left text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
            Home
          </button>
          <button onClick={() => { setCurrentPage('matcher'); toggleMenu(); }} className="block w-full text-left text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
            Matcher Page
          </button>
          <button onClick={() => { setCurrentPage('analysis'); toggleMenu(); }} className="block w-full text-left text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
            Analysis Page
          </button>
          {loggedInUser && (
            <div className="pt-2">
              <div className="flex items-center text-white text-base font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Welcome, {loggedInUser.displayName || loggedInUser.email || 'Recruiter'}!
              </div>
              <button
                onClick={() => { handleLogout(); toggleMenu(); }}
                className="w-full text-left ml-4 text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// ===========================================
// Home Page Component
// ===========================================
const HomePage = ({ loggedInUser }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-center text-white shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-pattern-green opacity-20 z-0"></div>
        <div className="relative z-10 p-6 rounded-xl bg-black bg-opacity-30 backdrop-blur-sm">
          <h2 className="text-5xl font-extrabold mb-4 tracking-tight leading-tight">
            Welcome{loggedInUser ? `, ${loggedInUser.displayName || loggedInUser.email}` : ''} to AI-Recruitment
          </h2>
          <p className="text-xl font-light text-green-200">
            Your AI-powered recruitment solution
          </p>
          <div className="mt-6 flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white shadow-inner">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center p-6 bg-green-50 rounded-2xl shadow-md border border-green-200 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 13.937 0 0112 2.944a11.955 11.955 0 01-8.618 11.042m16.837 0A11.955 11.955 0 0112 21.056a11.955 11.955 0 01-8.618-11.042" />
                </svg>
              </div>
              <p className="text-xl font-semibold mb-2 text-gray-700">Step 1</p>
              <p className="text-gray-600">Register an account and fill out your profile.</p>
            </div>
            {/* Step 2 */}
            <div className="text-center p-6 bg-green-50 rounded-2xl shadow-md border border-green-200 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0a2 2 0 110 4m-3 6v-4m0 0l3 3m-3-3l3-3" />
                </svg>
              </div>
              <p className="text-xl font-semibold mb-2 text-gray-700">Step 2</p>
              <p className="text-gray-600">Upload job descriptions and candidate resumes.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center p-6 bg-green-50 rounded-2xl shadow-md border border-green-200 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0h5.5l-5.5-2m-2-2L9 9m7.5-4h-5.5m0 0L9 9m7.5-4h-5.5m0 0L9 9" />
                </svg>
              </div>
              <p className="text-xl font-semibold mb-2 text-gray-700">Step 3</p>
              <p className="text-gray-600">Use AI to match candidates to job descriptions.</p>
            </div>
            {/* Step 4 */}
            <div className="text-center p-6 bg-green-50 rounded-2xl shadow-md border border-green-200 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-xl font-semibold mb-2 text-gray-700">Step 4</p>
              <p className="text-gray-600">Review and hire the best candidates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections (similar to image's bottom cards) */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-2xl shadow-xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-3">Candidate to Job Matching</h4>
              <p className="text-lg font-light">Our AI matches candidates to job descriptions with high accuracy.</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-2xl shadow-xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-3">Behavioral Analysis</h4>
              <p className="text-lg font-light">Analyze candidate behaviors to find the best fit for your company.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-2xl shadow-xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-3">Match Multiple Candidates</h4>
              <p className="text-lg font-light">Match multiple candidates against a single job description efficiently.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


// ===========================================
// Matcher Page Component (Your existing AI tool UI)
// ===========================================
const MatcherPage = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleMatch = async () => {
    setErrorMessage('');
    setMatchResult(null);
    setIsLoading(true);

    if (!jobDescription || !resume) {
      setErrorMessage('Please enter both a job description and a resume.');
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Call the /match endpoint for analysis
      const matchResponse = await fetch('http://localhost:8000/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription, resume: resume })
      });

      if (!matchResponse.ok) {
        const errorData = await matchResponse.json();
        throw new Error(errorData.detail || 'Something went wrong with the AI matching API request.');
      }

      const matchData = await matchResponse.json();
      setMatchResult(matchData);

      // Step 2: If it's a good match, send data to the /shortlist_candidate endpoint
      if (matchData.is_good_match) {
        console.log("Candidate shortlisted! Sending to Firestore...");
        const shortlistPayload = {
          candidate_id: matchData.candidate_id, // Use ID from matchData
          candidate_name: matchData.candidate_name, // Use name from matchData
          candidate_department: matchData.candidate_department, // Use department from matchData
          match_score: matchData.bert_similarity_score,
          shortlisted_status: true,
          // You might need to extract gender from resume or pass it through if available
          simulated_gender: 'Unknown' // Placeholder, ideally would be extracted
        };

        const shortlistResponse = await fetch('http://localhost:8000/shortlist_candidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shortlistPayload)
        });

        if (!shortlistResponse.ok) {
          const errorData = await shortlistResponse.json();
          console.error("Error saving shortlisted candidate to Firestore:", errorData);
          setErrorMessage((prev) => prev + " Failed to save shortlisted candidate.");
        } else {
          console.log("Shortlisted candidate saved successfully to Firestore.");
        }
      }

    } catch (error) {
      console.error("Error during API call:", error);
      setErrorMessage(`Failed to get results: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-purple-50 to-indigo-100 p-4 font-sans text-gray-800 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-4xl border border-indigo-200">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 tracking-tight">
          AI Recruitment Matcher
        </h1>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="jobDescription" className="block text-lg font-semibold text-indigo-600 mb-2">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              className="w-full p-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 resize-y min-h-[150px] shadow-sm"
              rows="8"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here (e.g., 'Seeking a Software Engineer with Python experience in ML...')"
            ></textarea>
          </div>
          <div>
            <label htmlFor="resume" className="block text-lg font-semibold text-indigo-600 mb-2">
              Candidate Resume
            </label>
            <textarea
              id="resume"
              className="w-full p-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 resize-y min-h-[150px] shadow-sm"
              rows="8"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste the candidate's resume text here (e.g., 'Experienced Python developer, skilled in deep learning...')"
            ></textarea>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6 animate-pulse" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <div className="text-center mb-8">
          <button
            onClick={handleMatch}
            className={`px-8 py-4 rounded-full text-white font-bold text-xl shadow-lg transition-all duration-300 ease-in-out
              ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transform hover:-translate-y-1'}
              focus:outline-none focus:ring-4 focus:ring-indigo-300`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Match Resume & Job Description'
            )}
          </button>
        </div>

        {/* Results Section */}
        {matchResult && (
          <div className="mt-8 bg-indigo-50 p-6 rounded-2xl shadow-inner border border-indigo-200 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4 text-center">Matching Results</h2>
            <div className="flex flex-col sm:flex-row justify-around items-center gap-6 text-center">
              <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-200 w-full sm:w-1/2">
                <p className="text-xl font-semibold text-gray-700 mb-2">BERT Similarity Score:</p>
                <p className="text-5xl font-extrabold text-indigo-600">
                  {matchResult.bert_similarity_score.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-2">(Higher is better)</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-200 w-full sm:w-1/2">
                <p className="text-xl font-semibold text-gray-700 mb-2">Shortlisting Status:</p>
                <p className={`text-5xl font-extrabold ${matchResult.is_good_match ? 'text-green-600' : 'text-red-600'}`}>
                  {matchResult.is_good_match ? 'Shortlisted!' : 'Not Shortlisted'}
                </p>
                <p className="text-md text-gray-500 mt-2">{matchResult.message}</p>
              </div>
            </div>

            {/* Bias Insights Section - Now populated by backend */}
            <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border border-yellow-200 shadow-inner">
              <h3 className="text-2xl font-bold text-yellow-800 mb-3 text-center">Bias Insights</h3>
              <p className="text-lg text-gray-700 text-center mb-4">
                {matchResult.bias_insight_message}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200">
                  <h4 className="font-semibold text-yellow-700">Overall Fairness Ratios:</h4>
                  <p>Demographic Parity: {matchResult.fairness_metrics_overall.demographic_parity_ratio.toFixed(3)}</p>
                  <p>Equalized Odds: {matchResult.fairness_metrics_overall.equalized_odds_ratio.toFixed(3)}</p>
                  <p className="text-sm text-gray-500">(Closer to 1 is fairer)</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200">
                  <h4 className="font-semibold text-yellow-700">Metrics By Group (Simulated Gender):</h4>
                  {Object.entries(matchResult.fairness_metrics_by_group).map(([group, metrics]) => (
                    <div key={group} className="mb-2">
                      <p className="font-medium">{group}:</p>
                      <ul className="list-disc list-inside text-sm ml-4">
                        <li>Accuracy: {metrics.accuracy.toFixed(3)}</li>
                        <li>Recall: {metrics.recall.toFixed(3)}</li>
                        <li>Precision: {metrics.precision.toFixed(3)}</li>
                        <li>F1-Score: {metrics.f1.toFixed(3)}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
