
import React, { useState, useEffect } from 'react';

const AnalysisPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch shortlisted candidates when the component mounts
    const fetchCandidates = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await fetch('http://localhost:8000/get_shortlisted_candidates');
        if (!response.ok) {
          throw new Error('Failed to fetch shortlisted candidates from backend.');
        }
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, []); // Empty dependency array means this effect runs only once

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000); // Firestore timestamp is in seconds
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-blue-100 p-8 font-sans text-gray-800 flex flex-col items-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-6xl border border-blue-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8 tracking-tight">
          Shortlisted Candidates for Review
        </h1>

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-blue-700">Loading candidates...</p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6 text-center" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {!isLoading && !errorMessage && candidates.length === 0 && (
          <div className="text-center p-10 bg-blue-50 rounded-xl shadow-inner">
            <h2 className="text-2xl font-semibold text-blue-800">No Candidates Shortlisted Yet</h2>
            <p className="text-lg text-gray-600 mt-2">
              Use the Matcher Page to find and save your first candidate!
            </p>
          </div>
        )}

        {!isLoading && !errorMessage && candidates.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-md border border-blue-200">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="py-3 px-6 text-left font-semibold text-sm rounded-tl-xl">Candidate ID</th>
                  <th className="py-3 px-6 text-left font-semibold text-sm">Name</th>
                  <th className="py-3 px-6 text-left font-semibold text-sm">Department</th>
                  <th className="py-3 px-6 text-left font-semibold text-sm">Match Score</th>
                  <th className="py-3 px-6 text-left font-semibold text-sm rounded-tr-xl">Shortlisted On</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={candidate.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors duration-200`}>
                    <td className="py-4 px-6 text-sm text-gray-700">{candidate.candidate_id}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{candidate.candidate_name}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{candidate.candidate_department}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className="text-sm font-semibold text-green-600">
                        {candidate.match_score.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{formatDate(candidate.shortlisted_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};