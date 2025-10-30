import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase-config.js';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    try {
      // Sign in with Google using a popup
      const result = await signInWithPopup(auth, provider);
      // The user object contains all the user info
      const user = result.user;
      console.log("User signed in:", user.displayName);

    } catch (err) {
      console.error("Firebase Sign-in Error:", err);
      // Handle different Firebase errors
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Sign-in request was cancelled. Please try again.');
      } else {
        setError(`Failed to sign in: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-green-800 font-sans p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-sm w-full text-center border-t-8 border-green-500">
        <div className="flex justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Recruiter Login</h2>
        <p className="text-gray-600 mb-8">Sign in to access your AI recruitment dashboard.</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-200'}`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="mr-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.99 12.553c0-.79-.07-1.543-.201-2.261H12.23v4.27H18.25c-.294 1.542-1.125 2.867-2.327 3.732v3.084h3.987c2.318-2.13 3.65-5.244 3.65-9.225z" fill="#4285F4"/>
                <path d="M12.23 22c2.927 0 5.385-.97 7.18-2.624l-3.987-3.084c-1.105.742-2.527 1.173-3.193 1.173-2.65 0-4.908-1.79-5.713-4.148H2.434v3.167C4.168 20.306 7.971 22 12.23 22z" fill="#34A853"/>
                <path d="M6.517 14.736c-.22-.66-.347-1.37-.347-2.126s.127-1.466.347-2.126V7.38h-4.08C2.083 8.715 1.75 10.53 1.75 12.61c0 2.08.333 3.895.737 5.23L6.517 14.736z" fill="#FBBC04"/>
                <path d="M12.23 4.148c1.332 0 2.53.45 3.468 1.348l3.12-3.042C17.616 1.385 15.158.214 12.23.214 7.971.214 4.168 1.898 2.435 4.312l4.081 3.167c.805-2.358 3.063-4.148 5.714-4.148z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;