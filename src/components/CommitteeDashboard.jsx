// frontend/src/components/CommitteeDashboard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <motion.div
          key={t.key}
          className={`bento-tile ${t.size || ''}`.trim()}
          onClick={() => setSelected(t.key)}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3>{t.title}</h3>
          <p>{t.desc}</p>
        </motion.div>
      ))}

      <AnimatePresence>
        {selected && (
          <motion.div
            key="expanded"
            className="tile-expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button className="close-button" onClick={() => setSelected(null)}>×</button>
            <h2>{tiles.find(t => t.key === selected)?.title}</h2>
            <p>Feature coming soon.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommitteeDashboard;
