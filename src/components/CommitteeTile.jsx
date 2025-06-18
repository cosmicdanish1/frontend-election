// frontend/src/components/CommitteeTile.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../App.css';

/**
 * Bento grid tile with optional live preview snippet.
 */
const CommitteeTile = ({ tile, onSelect }) => {
  const [count, setCount] = useState(null);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // fetch count for candidate tile
  useEffect(() => {
    if (tile.key === 'candidateManagement') {
      fetch(`${API}/api/candidates`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => setCount(data.length))
        .catch(() => {});
    }
  }, [tile.key, API]);

  return (
    <motion.div
      layoutId={tile.key}
      className={`bento-tile ${tile.size || ''}`.trim()}
      onClick={() => onSelect(tile.key)}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3>{tile.title}</h3>
      <p>{tile.desc}</p>
      {tile.key === 'candidateManagement' && (
        <small className="tile-hint">Click to add, edit or delete candidates</small>
      )}

      
      {tile.key === 'candidateManagement' && count !== null && (
        <small style={{color:'#61dafb',marginTop:'4px',display:'block'}}>{count} candidates</small>
      )}
    </motion.div>
  );
};

export default CommitteeTile;
