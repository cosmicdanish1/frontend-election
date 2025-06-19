import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css';
import CandidateDetailModal from './CandidateDetailModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterModal = ({ isOpen, onClose, onRegisterSuccess, currentUser }) => {
  const [form, setForm] = useState({
    aadhar: '',
    voterId: '',
    address: '',
    dob: '',
    nationality: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.aadhar || !form.voterId || !form.address || !form.dob || !form.nationality) {
      return 'All fields are required.';
    }
    if (form.nationality.trim().toLowerCase() !== 'indian') {
      return 'Only Indian nationals can register.';
    }
    const dobDate = new Date(form.dob);
    const age = ((new Date()).getTime() - dobDate.getTime()) / (1000 * 3600 * 24 * 365.25);
    if (isNaN(age) || age < 18) {
      return 'You must be at least 18 years old to register.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    const userid = currentUser?.id || currentUser?.userid;
    console.log('Registering with userid:', userid, 'currentUser:', currentUser);
    if (!userid) {
      setError('User ID not found. Please reload the page and try again.');
      return;
    }
    try {
      await axios.post('/api/voter-registration', {
        userid,
        aadharid: form.aadhar,
        votercardid: form.voterId,
        dob: form.dob,
        address: form.address,
        nationality: form.nationality
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onRegisterSuccess(form);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Voter Registration</h2>
        {error && <div className="error-message">{error}</div>}
        {success ? (
          <div className="success-message">Registration successful!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Aadhar Number</label>
              <input name="aadhar" value={form.aadhar} onChange={handleChange} maxLength={12} required />
            </div>
            <div className="form-group">
              <label>Voter Card ID</label>
              <input name="voterId" value={form.voterId} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input name="address" value={form.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input name="dob" type="date" value={form.dob} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Nationality</label>
              <select name="nationality" value={form.nationality} onChange={handleChange} required>
                <option value="">Select Nationality</option>
                <option value="indian">Indian</option>
                <option value="nri">NRI</option>
                <option value="non-india">Non-India</option>
              </select>
            </div>
            <button type="submit" className="submit-button">Register</button>
            <button type="button" className="close-button" onClick={onClose}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

const VoterDashboard = () => {
  const navigate = useNavigate();
  const [selectedTile, setSelectedTile] = useState(null);
  const [elections, setElections] = useState([]);
  const [loadingElections, setLoadingElections] = useState(false);
  const [errorElections, setErrorElections] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchElections();
    fetchCandidates();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    console.log('🔍 === fetchUserProfile START ===');
    console.log('🔍 Current axios defaults:', {
      baseURL: axios.defaults.baseURL,
      withCredentials: axios.defaults.withCredentials
    });
    
    setLoadingProfile(true);
    try {
      console.log('🔍 Making request to /api/users/profile');
      console.log('🔍 Request will be sent to:', `${axios.defaults.baseURL}/api/users/profile`);
      
      const response = await axios.get('/api/users/profile', {
        withCredentials: true
      });
      
      console.log('✅ Profile request successful');
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', response.headers);
      console.log('🔍 Response data:', response.data);
      
      setUserProfile(response.data);
    } catch (err) {
      console.error('❌ Error fetching user profile:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error request:', err.request);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error config:', err.config);
      
      if (err.response) {
        console.error('❌ Response status:', err.response.status);
        console.error('❌ Response data:', err.response.data);
        console.error('❌ Response headers:', err.response.headers);
      }
      
      setErrorProfile('Failed to load user profile.');
    } finally {
      setLoadingProfile(false);
      console.log('🔍 === fetchUserProfile END ===');
    }
  };

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
    if (!isRegistered) {
      alert('You must register as a voter before you can vote.');
      return;
    }
    navigate(`/vote/${electionId}`);
  };

  console.log('VoterDashboard render - candidates state:', candidates);

  return (
    <motion.div className="voter-dashboard">
      {/* Register Card (Wide, Top) */}
      <motion.div
        className="bento-tile tile-wide"
        onClick={() => userProfile && userProfile.id ? setIsRegisterModalOpen(true) : null}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          marginBottom: '1.5rem',
          opacity: userProfile && userProfile.id ? 1 : 0.5,
          pointerEvents: userProfile && userProfile.id ? 'auto' : 'none'
        }}
      >
        <h3>Register Card</h3>
        {loadingProfile && <p>Loading your profile...</p>}
        {errorProfile && <p className="error-message">{errorProfile}</p>}
        {!loadingProfile && !errorProfile && !(userProfile && userProfile.id) && (
          <p>Profile not loaded. Please refresh or log in again.</p>
        )}
        <p>Register for upcoming elections or as a new voter. (Click to register)</p>
      </motion.div>

      {/* Voter Profile Tile (Large) */}
      <motion.div
        className="bento-tile tile-large"
        onClick={() => handleTileClick('voterProfile')}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h3>Voter Profile</h3>
        <p>View your personal information and voting status.</p>
        {loadingProfile && <p>Loading profile...</p>}
        {errorProfile && <p className="error-message">{errorProfile}</p>}
        {userProfile && (
          <div className="profile-preview">
            <div className="profile-avatar">
              <span>{userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <div className="profile-info">
              <h4>{userProfile.name || 'Name not set'}</h4>
              <p>{userProfile.email}</p>
              <p className="status-badge">{userProfile.status}</p>
            </div>
          </div>
        )}
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
              {selectedTile === 'voterProfile' && (
                <div className="voter-profile-expanded">
                  <h2>Voter Profile</h2>
                  {loadingProfile && <p>Loading profile...</p>}
                  {errorProfile && <p className="error-message">{errorProfile}</p>}
                  {userProfile && (
                    <div className="profile-details">
                      <div className="profile-header">
                        <div className="profile-avatar-large">
                          <span>{userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}</span>
                        </div>
                        <div className="profile-basic-info">
                          <h3>{userProfile.name || 'Name not set'}</h3>
                          <p className="user-role">{userProfile.role}</p>
                          <p className="user-status">
                            Status: <span className={`status-badge ${userProfile.status}`}>{userProfile.status}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="profile-sections">
                        <div className="profile-section">
                          <h4>Personal Information</h4>
                          <div className="info-grid">
                            <div className="info-item">
                              <label>Full Name:</label>
                              <span>{userProfile.name || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                              <label>Gender:</label>
                              <span>{userProfile.gender ? userProfile.gender.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                              <label>Date of Birth:</label>
                              <span>{userProfile.date_of_birth ? new Date(userProfile.date_of_birth).toLocaleDateString() : 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                              <label>Email Address:</label>
                              <span>{userProfile.email}</span>
                            </div>
                            <div className="info-item">
                              <label>Contact Number:</label>
                              <span>{userProfile.contact_number || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                              <label>Aadhar ID:</label>
                              <span>{userProfile.aadhar_id || 'Not provided'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="profile-section">
                          <h4>Address Information</h4>
                          <div className="info-grid">
                            <div className="info-item">
                              <label>Address:</label>
                              <span>{userProfile.address || 'Not provided'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="profile-section">
                          <h4>Account Information</h4>
                          <div className="info-grid">
                            <div className="info-item">
                              <label>User ID:</label>
                              <span>{userProfile.id}</span>
                            </div>
                            <div className="info-item">
                              <label>Account Type:</label>
                              <span className="role-badge">{userProfile.role}</span>
                            </div>
                            <div className="info-item">
                              <label>Member Since:</label>
                              <span>{new Date(userProfile.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="info-item">
                              <label>Last Updated:</label>
                              <span>{new Date(userProfile.updated_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterSuccess={() => setIsRegistered(true)}
        currentUser={userProfile}
      />

    </motion.div>
  );
};

export default VoterDashboard; 