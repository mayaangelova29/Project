import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogOut, User as UserIcon, Star, CheckCircle, RefreshCw, Camera, Pencil, Check, X } from 'lucide-react';

export const Profile: React.FC = () => {
  const { state, setProfilePhoto, setUserName, resetState } = useAppContext();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(state.userName || '');

  const handleSaveName = () => {
    if (editNameValue.trim()) {
      setUserName(editNameValue.trim());
    }
    setIsEditingName(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const photoData = reader.result as string;
        setProfilePhoto(photoData);

        if (state.email) {
          try {
            const res = await fetch(`http://localhost:3001/users?email=${state.email}`);
            const users = await res.json();
            if (users.length > 0) {
              await fetch(`http://localhost:3001/users/${users[0].id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profilePhoto: photoData })
              });
            }
          } catch (error) {
            console.error("Failed to save photo to DB", error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    resetState();
    navigate('/');
  };

  const handleRetakeQuiz = () => {
    navigate('/onboarding');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="text-center mb-8">
        <label 
          style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-color)', 
          margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)', border: '2px solid var(--primary-color)',
          cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
        >
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handlePhotoUpload} 
          />
          {state.profilePhoto ? (
            <img src={state.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <UserIcon size={40} color="var(--primary-color)" />
          )}
        </label>
        {isEditingName ? (
          <div className="flex items-center justify-center gap-2 mb-1 mt-4">
            <input 
              type="text" 
              value={editNameValue} 
              onChange={(e) => setEditNameValue(e.target.value)}
              className="input text-center"
              autoFocus
              style={{ padding: '4px 8px', width: '200px' }}
            />
            <button onClick={handleSaveName} className="btn btn-secondary" style={{ padding: '6px' }}><Check size={16} color="var(--success-color)"/></button>
            <button onClick={() => setIsEditingName(false)} className="btn btn-secondary" style={{ padding: '6px' }}><X size={16} color="#ef4444"/></button>
          </div>
        ) : (
          <h1 className="text-2xl mb-1 mt-4 flex items-center justify-center gap-2">
            {state.userName || 'Athlete'}
            <button onClick={() => { setEditNameValue(state.userName || ''); setIsEditingName(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
              <Pencil size={16} />
            </button>
          </h1>
        )}
        <p className="text-muted text-sm mb-4">VibeFit Member</p>
        
        <label className="btn btn-secondary inline-flex items-center gap-2 mx-auto" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.85rem', width: 'fit-content' }}>
          <Camera size={16} /> Change Photo
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handlePhotoUpload} 
          />
        </label>
      </div>

      <div className="grid-cards mb-6" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="card text-center p-4">
          <div className="text-xs text-muted mb-1 uppercase tracking-wider font-bold">Total Points</div>
          <div className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>{state.points}</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-xs text-muted mb-1 uppercase tracking-wider font-bold">Check-ins</div>
          <div className="text-2xl font-bold flex items-center justify-center gap-1">
            <CheckCircle size={20} color="var(--success-color)" /> {state.checkIns.length}
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="text-lg mb-3 flex items-center gap-2">
          <Star size={18} color="var(--accent-color)" /> Your Vibe Profile
        </h3>
        <p className="text-sm text-muted mb-8">
          These are the traits we extracted from your onboarding responses. We use these to find your perfect environments.
        </p>
        
        <div className="flex gap-2 flex-wrap mb-8">
          {state.userKeywords.length > 0 ? state.userKeywords.map((kw) => (
            <span key={kw} className="badge" style={{ background: 'var(--primary-color)', color: '#fff', borderColor: 'transparent', padding: '6px 12px' }}>
              {kw}
            </span>
          )) : (
            <span className="text-sm text-muted italic">No vibe profile established.</span>
          )}
        </div>

        <button 
          onClick={handleRetakeQuiz}
          className="btn btn-secondary w-full"
        >
          <RefreshCw size={18} /> Retake Psychology Quiz
        </button>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full card"
        style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          color: '#ef4444',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
          fontWeight: 'bold', cursor: 'pointer'
        }}
      >
        <LogOut size={20} /> Log Out Account
      </button>

    </div>
  );
};
