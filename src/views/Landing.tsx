import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User, Lock, Mail, BrainCircuit, Trophy, MapPin, LogOut } from 'lucide-react';

export const Landing: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, setAuthenticated, resetState } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (email && password) {
        setAuthenticated(true, email.split('@')[0]);
        navigate('/onboarding');
      }
    } else {
      if (name && email && password) {
        setAuthenticated(true, name);
        navigate('/onboarding');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '1200px', padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center' }}>
        
        {/* Left Column: Homepage Pitch & Explanation */}
        <div style={{ flex: '1 1 400px' }}>
          <h1 className="text-gradient" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '16px' }}>VibeFit</h1>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '24px' }}>
            Find the Gym Where You Actually Belong.
          </h2>
          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
            Don't guess where to work out. VibeFit uses a rapid psychological and physical preference quiz to match your unique <strong>"vibe"</strong> strictly with the culture, style, and intensity of nearby sports venues.
          </p>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <BrainCircuit size={24} color="var(--primary-color)" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Psychological Matching</h4>
                <p className="text-muted text-sm" style={{ margin: 0 }}>Answer a 7-step profile analyzer to map your workout intensity and preferred social atmosphere.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <MapPin size={24} color="var(--accent-color)" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Location-Aware Intelligence</h4>
                <p className="text-muted text-sm" style={{ margin: 0 }}>We rank venues strictly within a 10km GPS radius using a powerful 60/40 algorithm blending Match % and proximity.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <Trophy size={24} color="#f59e0b" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Gamify Your Consistency</h4>
                <p className="text-muted text-sm" style={{ margin: 0 }}>Check in at locations, earn 100 points per visit, and compete on our global monthly athlete Leaderboard.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Card */}
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '40px 32px', background: 'rgba(30, 41, 59, 0.7)' }}>
            
            {state.isAuthenticated && state.userName ? (
              <div className="text-center">
                <h2 className="mb-4" style={{ fontSize: '1.8rem' }}>Welcome Back, {state.userName}!</h2>
                <p className="text-muted mb-8">You're already logged in to your account.</p>
                <button 
                  onClick={() => navigate(state.hasOnboarded ? '/app' : '/onboarding')}
                  className="btn w-full mb-4" 
                  style={{ fontSize: '1.1rem', padding: '16px 24px' }}
                >
                  Enter Dashboard
                </button>
                <button 
                  onClick={() => resetState()}
                  className="btn-secondary w-full"
                  style={{ fontSize: '1rem', padding: '12px 24px', display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)' }}
                >
                  <LogOut size={18} /> Switch Account
                </button>
              </div>
            ) : (
             <>
              <h2 className="mb-8 text-center" style={{ fontSize: '1.8rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {!isLogin && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted uppercase font-bold tracking-wider">Name</label>
                    <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <User size={20} className="text-muted" />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted uppercase font-bold tracking-wider">Email</label>
                <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Mail size={20} className="text-muted" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted uppercase font-bold tracking-wider">Password</label>
                <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Lock size={20} className="text-muted" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn w-full mt-4" style={{ fontSize: '1.1rem', padding: '16px 24px' }}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

              <div className="mt-8 text-center text-muted">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                >
                  {isLogin ? 'Sign Up Today' : 'Log In Here'}
                </button>
              </div>
             </>
            )}
            
          </div>
        </div>
        
      </div>
    </div>
  );
};
