import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User, Lock, Mail } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthenticated } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication for MVP
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
    <div className="app-container justify-center items-center p-6">
      <div className="text-center mb-8 w-full">
        <h1 className="text-3xl mb-2"><span className="text-gradient">VibeFit</span></h1>
        <p className="text-muted">Find your perfect workout tribe.</p>
      </div>

      <div className="card w-full" style={{ padding: '32px 24px' }}>
        <h2 className="mb-6 text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted uppercase font-bold tracking-wider">Name</label>
              <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <User size={18} className="text-muted" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%' }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted uppercase font-bold tracking-wider">Email</label>
            <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Mail size={18} className="text-muted" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted uppercase font-bold tracking-wider">Password</label>
            <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Lock size={18} className="text-muted" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%' }}
              />
            </div>
          </div>

          <button type="submit" className="btn w-full mt-4">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};
