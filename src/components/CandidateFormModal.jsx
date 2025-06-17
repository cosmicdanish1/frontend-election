// frontend/src/components/CandidateFormModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css';

const CandidateFormModal = ({ initial, electionType, onSave, onClose }) => {
  const [form, setForm] = useState(
    initial ?? {
      Name: '',
      PartyName: '',
      LocationRegion: '',
      ElectionType: electionType,
      // ElectionId will be set on backend via type mapping or you can add a select

    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    // determine API endpoint and method
    const method = initial ? 'PUT' : 'POST';
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = initial ? `${API}/api/candidates/${initial.CandidateId}` : `${API}/api/candidates`;

    try {
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(`Save failed: ${msg}`);
        return;
      }
      const saved = await res.json();
      onSave(saved);
    } catch (err) {
      console.error('Save candidate error', err);
      alert('Network error – could not save');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="modal-content" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <h2>{initial ? 'Edit Candidate' : 'Add Candidate'}</h2>
          <form className="cm-form" onSubmit={submit}>
            <label>
              Name
              <input name="Name" value={form.Name} onChange={handleChange} required />
            </label>
            <label>
              Party
              <input name="PartyName" value={form.PartyName} onChange={handleChange} required />
            </label>
            <label>
              Place
              <input name="LocationRegion" value={form.LocationRegion} onChange={handleChange} required />
            </label>
            <button type="submit" className="submit-button">
              {initial ? 'Save' : 'Add'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CandidateFormModal;
