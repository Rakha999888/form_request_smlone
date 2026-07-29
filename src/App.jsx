import React, { useState, useEffect } from 'react';
import DeveloperRequestForm from './components/DeveloperRequestForm';
import RequestSuccessCard from './components/RequestSuccessCard';

import logoSmlone from './assets/logo-smlone.png';

const STORAGE_KEY = 'dev_requests_v2';
const LAST_SUBMITTED_KEY = 'last_submitted_req_v1';

export default function App() {
  const [lastSubmittedRequest, setLastSubmittedRequest] = useState(() => {
    try {
      const saved = localStorage.getItem(LAST_SUBMITTED_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading last submitted request:', e);
    }
    return null;
  });

  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem(LAST_SUBMITTED_KEY);
      if (saved) return 'status';
    } catch (e) {
      console.error(e);
    }
    return 'form';
  });

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      if (lastSubmittedRequest) {
        localStorage.setItem(LAST_SUBMITTED_KEY, JSON.stringify(lastSubmittedRequest));
      } else {
        localStorage.removeItem(LAST_SUBMITTED_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [lastSubmittedRequest]);

  const handleAddRequest = (newReq) => {
    setRequests((prev) => [newReq, ...prev]);
    setLastSubmittedRequest(newReq);
    setCurrentView('status');
  };

  const handleNewRequest = () => {
    setLastSubmittedRequest(null);
    localStorage.removeItem(LAST_SUBMITTED_KEY);
    setCurrentView('form');
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="app-header">
        <img
          src={logoSmlone}
          alt="SMLONE"
          style={{ height: '90px', objectFit: 'contain', marginBottom: '1rem' }}
        />
        <h1>Formulir Request Developer</h1>
        <p>Kelola dan ajukan kebutuhan pengembangan fitur secara terstruktur &amp; jelas.</p>
      </header>

      {/* Main Content */}
      <main>
        {currentView === 'form' ? (
          <DeveloperRequestForm
            onSubmitSuccess={(newReq) => {
              handleAddRequest(newReq);
            }}
          />
        ) : (
          <RequestSuccessCard
            requestData={lastSubmittedRequest}
            onNewRequest={handleNewRequest}
          />
        )}
      </main>
    </div>
  );
}
