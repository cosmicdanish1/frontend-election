import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CandidateDetailModal = ({ candidate, isOpen, onClose }) => {
  if (!isOpen || !candidate) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="candidate-detail-modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button 
            className="close-button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            &times;
          </motion.button>
          
          <div className="candidate-header">
            {candidate.PhotoUrl && (
              <img src={candidate.PhotoUrl} alt={candidate.Name} className="candidate-photo" />
            )}
            <h3>{candidate.Name}</h3>
            <div className="party-badge">{candidate.Party}</div>
          </div>

          <div className="candidate-stats">
            <div className="stat-card">
              <h4>Total Votes</h4>
              <div className="stat-value">{candidate.VoteCount || 0}</div>
            </div>
            <div className="stat-card">
              <h4>Unique Voters</h4>
              <div className="stat-value">{candidate.VoterIDs || 0}</div>
            </div>
          </div>

          <div className="candidate-details">
            <p><strong>Election:</strong> {candidate.ElectionName || 'N/A'}</p>
            <p><strong>Bio:</strong> {candidate.Bio || 'No bio available.'}</p>
            <p><strong>Party:</strong> {candidate.Party}</p>
            <p><strong>Position:</strong> {candidate.Position || 'N/A'}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CandidateDetailModal; 