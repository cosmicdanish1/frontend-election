// frontend/src/components/CandidateManagement.jsx
import React, { useEffect, useState } from 'react';
import CandidateFormModal from './CandidateFormModal';
import '../App.css';

const TABS = ['Nagar', 'Lok Sabha', 'Vidhan Sabha'];
const TYPE_MAP = { Nagar: 'Local', 'Lok Sabha': 'National', 'Vidhan Sabha': 'State' };

const CandidateManagement = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [candidates, setCandidates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API}/api/candidates`, { credentials: 'include' })
      .then(r => r.json())
      .then(setCandidates)
      .catch(console.error);
  }, []);

  const backendType = (tab) => TYPE_MAP[tab];

  const filtered = candidates.filter((c) => c.ElectionType === backendType(activeTab));

  const upsertCandidate = (cand) => {
    setCandidates((prev) => {
      const idx = prev.findIndex((c) => c.CandidateId === cand.CandidateId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = cand;
        return copy;
      }
      return [...prev, cand];
    });
  };

  const deleteCandidate = (id) => setCandidates((prev) => prev.filter((c) => c.CandidateId !== id));

  return (
    <div className="candidate-mgmt">
      <div className="cm-header">
        <div className="cm-tabs">
          {TABS.map((tab) => (
            <button key={tab} className={tab === activeTab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
        <button
          className="cm-add-btn"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + Add Candidate
        </button>
      </div>

      <table className="cm-grid">
        <thead>
          <tr>
            <th>Sr</th>
            <th>Name</th>
            <th>Party</th>
            <th>Place</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c, i) => (
            <tr key={c.CandidateId}>
              <td>{i + 1}</td>
              <td>{c.Name}</td>
              <td>{c.PartyName}</td>
              <td>{c.LocationRegion}</td>
              <td>
                <button
                  onClick={() => {
                    setEditing(c);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button onClick={async () => {
                  if (!window.confirm('Are you sure you want to delete this candidate?')) return;
                  try {
                    await fetch(`${API}/api/candidates/${c.CandidateId}`, {
                      method: 'DELETE', credentials: 'include'
                    });
                    deleteCandidate(c.CandidateId);
                  } catch (err) {
                    console.error('Delete failed', err);
                    alert('Failed to delete candidate');
                  }
                }}>Delete</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No candidates
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <CandidateFormModal
          initial={editing}
          electionType={backendType(activeTab)}
          onSave={(cand) => {
            upsertCandidate(cand);
            setShowForm(false);
          }}
          /* onClose is not used but kept for future */
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default CandidateManagement;
