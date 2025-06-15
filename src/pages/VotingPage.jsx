import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const VotingPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingSuccess, setVotingSuccess] = useState(false);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Get current user's ID
        const [electionRes, voteStatusRes] = await Promise.all([
          axios.get(`/api/elections/${electionId}`),
          axios.get(`/api/elections/${electionId}/vote-status/${userId}`)
        ]);

        setElection(electionRes.data);
        setHasVoted(voteStatusRes.data.hasVoted);
        setLoading(false);
      } catch (err) {
        setError('Failed to load election data');
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [electionId]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate to vote for');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      await axios.post(`/api/elections/${electionId}/vote`, {
        candidateId: selectedCandidate.CandidateId,
        voterId: userId
      });

      setVotingSuccess(true);
      setHasVoted(true);
      
      // Redirect back to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit vote');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading election data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="voted-container">
        <h2>You have already voted in this election</h2>
        <p>Thank you for participating!</p>
        <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
      </div>
    );
  }

  if (votingSuccess) {
    return (
      <div className="success-container">
        <h2>Vote Submitted Successfully!</h2>
        <p>Thank you for participating in the election.</p>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="voting-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="election-header">
        <h1>{election?.Type} Election</h1>
        <p className="election-date">
          Date: {new Date(election?.Date).toLocaleDateString()}
        </p>
        <p className="election-location">
          Location: {election?.LocationRegion}
        </p>
        <p className="election-description">{election?.Description}</p>
      </div>

      <div className="candidates-grid">
        {election?.Candidates?.map((candidate) => (
          <motion.div
            key={candidate.CandidateId}
            className={`candidate-card ${selectedCandidate?.CandidateId === candidate.CandidateId ? 'selected' : ''}`}
            onClick={() => setSelectedCandidate(candidate)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {candidate.Symbol && (
              <img src={candidate.Symbol} alt={candidate.Name} className="candidate-photo" />
            )}
            <h3>{candidate.Name}</h3>
            <div className="party-badge">{candidate.PartyName}</div>
            <p className="position">{candidate.Position}</p>
            <div className="vote-count">
              Current Votes: {candidate.VoteCount || 0}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="voting-actions">
        <button 
          className="vote-button"
          onClick={handleVote}
          disabled={!selectedCandidate}
        >
          Submit Vote
        </button>
        <button 
          className="back-button"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default VotingPage; 