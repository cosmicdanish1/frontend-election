// frontend/src/components/CommitteeDashboard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommitteeTile from './CommitteeTile';
import CandidateManagement from './CandidateManagement';
import '../App.css';

const tiles = [
  { key: 'candidateManagement', title: 'Candidate Management', desc: 'Add or edit candidates.', size: 'tile-large' },
  { key: 'electionOverview',    title: 'Election Overview',    desc: 'Summary of all elections.', size: 'tile-tall'  },
  { key: 'voterDirectory',      title: 'Voter Directory',      desc: 'List of registered voters.' },
  { key: 'votingAnalytics',     title: 'Voting Analytics',     desc: 'Visual analytics of votes.', size: 'tile-wide' },
  { key: 'resultsSummary',      title: 'Results Summary',      desc: 'View election results.' },
  { key: 'committeeSettings',   title: 'Committee Settings',   desc: 'Manage committee preferences.' },
];

const CommitteeDashboard = () => {
  const [selected, setSelected] = useState(null);

  return (
    <motion.div className="voter-dashboard committee-dashboard">
      {tiles.map(t => (
        <CommitteeTile key={t.key} tile={t} onSelect={setSelected} />
      ))}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="expanded-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div layoutId={selected} className="expanded-tile-content">
              <button className="close-button" onClick={() => setSelected(null)}>×</button>
              {selected === 'candidateManagement' ? (
                <CandidateManagement onClose={() => setSelected(null)} />
              ) : (
                <>
                  <h2>{tiles.find(t => t.key === selected)?.title}</h2>
                  <p>Feature coming soon.</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommitteeDashboard;
