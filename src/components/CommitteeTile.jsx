// frontend/src/components/CommitteeTile.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../App.css';

/**
 * A reusable Bento tile that supports shared-element transition
 */
const CommitteeTile = ({ tile, onSelect }) => (
  <motion.div
    layoutId={tile.key} // enables morph animation with layoutId
    className={`bento-tile ${tile.size || ''}`.trim()}
    onClick={() => onSelect(tile.key)}
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <h3>{tile.title}</h3>
    <p>{tile.desc}</p>
  </motion.div>
);

export default CommitteeTile;
