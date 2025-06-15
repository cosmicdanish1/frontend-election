import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css';
import CandidateDetailModal from './CandidateDetailModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VoterDashboard = () => {
  const navigate = useNavigate();
  const [selectedTile, setSelectedTile] = useState(null);
  const [elections, setElections] = useState([]);
  const [loadingElections, setLoadingElections] = useState(false);
  const [errorElections, setErrorElections] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchElections();
    fetchCandidates();
  }, []);

  const fetchElections = async () => {
    setLoadingElections(true);
    try {
      const response = await axios.get('/api/elections');
      setElections(response.data);
    } catch (err) {
      console.error('Error fetching elections:', err);
      setErrorElections('Failed to load elections.');
    } finally {
      setLoadingElections(false);
    }
  };

  const fetchCandidates = async () => {
    console.log('Attempting to fetch candidates...');
    try {
      const response = await axios.get('/api/candidates');
      console.log('Raw candidates response data:', response.data);
      if (Array.isArray(response.data)) {
        setCandidates(response.data);
      } else {
        console.error('Candidates data is NOT an array:', response.data);
        setCandidates([]); // Ensure candidates is always an array to prevent .map() error
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setCandidates([]); // Also reset to empty array on fetch error
    }
  };

  const handleTileClick = (tileName) => {
    setSelectedTile(tileName);
  };

  const handleCloseTile = () => {
    setSelectedTile(null);
  };

  const handleVoteClick = (electionId) => {
    navigate(`/vote/${electionId}`);
  };

  console.log('VoterDashboard render - candidates state:', candidates);

  return (
    <motion.div className="voter-dashboard">
      {/* Upcoming Election Countdown Tile (Large) */}
      <motion.div
        className="bento-tile tile-large"
        onClick={() => handleTileClick('countdown')}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h3>Upcoming Election Countdown</h3>
        <p>Digital clock and countdown to the next election.</p>
        {/* Content for Countdown Timer */}
      </motion.div>

      {/* Candidate List Tile (Tall) */}
      <motion.div
        className="bento-tile tile-tall"
        onClick={() => handleTileClick('candidateList')}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h3>Candidate List</h3>
        <p>View all candidates for upcoming elections.</p>
        <ul className="candidate-list">
          {/* Check if candidates is an array before mapping */}
          {Array.isArray(candidates) && candidates.length > 0 ? (
            candidates.map(candidate => (
              <li key={candidate.CandidateId} onClick={(e) => {
                e.stopPropagation();
                setSelectedCandidate(candidate);
                setIsCandidateModalOpen(true);
              }}>
                {candidate.Name} ({candidate.PartyName})
              </li>
            ))
          ) : (
            <li>No candidates found.</li>
          )}
        </ul>
      </motion.div>

      {/* Ongoing Elections Tile (Wide) */}
      <motion.div
        className="bento-tile tile-wide"
        onClick={() => handleTileClick('ongoingElections')}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h3>Ongoing Elections</h3>
        <p>View and participate in active elections.</p>
        <div className="ongoing-elections-content">
          {loadingElections && <p>Loading elections...</p>}
          {errorElections && <p className="error-message">{errorElections}</p>}
          {!loadingElections && !errorElections && elections.length === 0 && <p>No ongoing elections found.</p>}
          {!loadingElections && !errorElections && elections.length > 0 && (
            <div className="election-grid">
              {elections.map(election => (
                <div key={election.ElectionId} className="election-item">
                  <div className="election-info">
                    <h4>{election.Type} Election</h4>
                    <p className="election-date">
                      Date: {new Date(election.Date).toLocaleDateString()}
                    </p>
                    <p className="election-location">
                      Location: {election.LocationRegion}
                    </p>
                    <p className="election-status">Status: {election.Status}</p>
                    <p className="candidate-count">
                      Candidates: {election.Candidates?.length || 0}
                    </p>
                  </div>
                  <button 
                    className="vote-now-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVoteClick(election.ElectionId);
                    }}
                  >
                    Vote Now
                  </button>
                </div>
              ))
            }
            </div>
          )}
        </div>
      </motion.div>

      {/* Election Results Tile (Standard) */}
      <motion.div
        className="bento-tile"
        onClick={() => handleTileClick('electionResults')}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h3>Election Results</h3>
        <p>View results for closed elections.</p>
        {/* Content for Election Results */}
      </motion.div>

      {/* My Voting History Tile (Standard) */}
      <motion.div
        className="bento-tile"
        onClick={() => handleTileClick('myVotingHistory')}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h3>My Voting History</h3>
        <p>See your past votes: election, candidate, party, and date.</p>
        {/* Content for My Voting History */}
      </motion.div>

      <AnimatePresence>
        {selectedTile && (
          <motion.div
            className="bento-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseTile}
          >
            <motion.div
              className="bento-expanded-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="close-button"
                onClick={handleCloseTile}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &times;
              </motion.button>
              {/* Expanded content based on selectedTile */}
              {selectedTile === 'ongoingElections' && (
                <div className="ongoing-elections-expanded">
                  <h2>Ongoing Elections</h2>
                  <div className="election-grid">
                    {elections.length > 0 ? (
                      elections.map(election => (
                        <motion.div 
                          key={election.ElectionId} 
                          className="election-card"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="election-card-content">
                            <h3>{election.Type} Election</h3>
                            <p className="election-date">
                              Date: {new Date(election.Date).toLocaleDateString()}
                            </p>
                            <p className="election-location">
                              Location: {election.LocationRegion}
                            </p>
                            <p className="election-status">Status: {election.Status}</p>
                            <p className="candidate-count">
                              Candidates: {election.Candidates?.length || 0}
                            </p>
                          </div>
                          <button 
                            className="vote-now-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVoteClick(election.ElectionId);
                            }}
                          >
                            Vote Now
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <p>No ongoing elections to display.</p>
                    )}
                  </div>
                </div>
              )}
              {selectedTile === 'candidateList' && (
                <div className="candidate-list-expanded">
                  <h2>Candidate List</h2>
                  <ul className="expanded-candidate-list">
                    {/* Check if candidates is an array before mapping */}
                    {Array.isArray(candidates) && candidates.length > 0 ? (
                      candidates.map(candidate => (
                        <li key={candidate.CandidateId} onClick={() => {
                          setSelectedCandidate(candidate);
                          setIsCandidateModalOpen(true);
                        }}>
                          <span className="candidate-name">{candidate.Name}</span>
                          <span className="candidate-party">({candidate.PartyName})</span>
                        </li>
                      ))
                    ) : (
                      <li>No candidates to display.</li>
                    )}
                  </ul>
                </div>
              )}
              {selectedTile === 'myVotingHistory' && (
                <div className="my-voting-history-expanded">
                  <h2>My Voting History</h2>
                  <p>Detailed view of your voting history will be displayed here.</p>
                </div>
              )}
              {selectedTile === 'countdown' && (
                <div className="countdown-expanded">
                  <h2>Upcoming Election Countdown</h2>
                  <p>Detailed countdown information here.</p>
                </div>
              )}
              {selectedTile === 'electionResults' && (
                <div className="election-results-expanded">
                  <h2>Election Results</h2>
                  <p>Detailed election results will be displayed here.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
      />

    </motion.div>
  );
};

export default VoterDashboard; 