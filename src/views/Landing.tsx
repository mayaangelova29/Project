import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User, Lock, Mail, BrainCircuit, Trophy, MapPin, LogOut, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export const Landing: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, setAuthenticated, resetState } = useAppContext();
  const navigate = useNavigate();

  // Intro Sequence State
  const [hasSeenIntro, setHasSeenIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0);

  useEffect(() => {
    // Only show intro if unauthenticated
    if (!state.isAuthenticated) {
      if (localStorage.getItem('vibefit_hasSeenIntro')) {
        setHasSeenIntro(true);
      } else {
        setHasSeenIntro(false);
      }
    }
  }, [state.isAuthenticated]);

  const completeIntro = () => {
    localStorage.setItem('vibefit_hasSeenIntro', 'true');
    setHasSeenIntro(true);
  };

  const handleNextIntroStep = () => {
    if (introStep < 3) {
      setIntroStep(introStep + 1);
    } else {
      completeIntro();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      setAuthenticated(true, name);
      navigate('/onboarding');
    }
  };

  // --- RENDERING ROUTING --- //

  // 1. Initial Full-Screen Intro Feature Carousel
  if (!state.isAuthenticated && !hasSeenIntro) {
    const introSlides = [
      {
        title: "Find the Gym Where You Actually Belong.",
        desc: "Don't guess where to work out. VibeFit uses a rapid psychological and physical preference quiz to match your unique vibe strictly with the culture, style, and intensity of nearby sports venues.",
        icon: null
      },
      {
        title: "Psychological Matching",
        desc: "Answer a 7-step profile analyzer to map your workout intensity and preferred social atmosphere.",
        icon: <BrainCircuit size={64} color="var(--primary-color)" />
      },
      {
        title: "Location-Aware Intelligence",
        desc: "We rank venues strictly within a 10km GPS radius using a powerful 60/40 algorithm blending Match % and proximity.",
        icon: <MapPin size={64} color="var(--accent-color)" />
      },
      {
        title: "Gamify Your Consistency",
        desc: "Check in at locations, earn 100 points per visit, and compete on our global monthly athlete Leaderboard.",
        icon: <Trophy size={64} color="#f59e0b" />
      }
    ];

    const slide = introSlides[introStep];

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '24px' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '48px', textAlign: 'center' }}>VibeFit</h1>

        <div key={introStep} className="card animate-intro" style={{ maxWidth: '600px', width: '100%', padding: '48px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '400px', justifyContent: 'center', background: 'rgba(56, 189, 248, 0.25)', border: '1px solid rgba(56, 189, 248, 0.4)', boxShadow: '0 8px 32px rgba(56, 189, 248, 0.25)', backdropFilter: 'blur(20px)' }}>

          <div style={{ marginBottom: '32px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {slide.icon ? (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '50%' }}>
                {slide.icon}
              </div>
            ) : (
              <BrainCircuit size={80} color="var(--primary-color)" style={{ opacity: 0.8 }} />
            )}
          </div>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '16px' }}>{slide.title}</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '48px', lineHeight: '1.6' }}>{slide.desc}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              {introStep > 0 && (
                <button onClick={() => setIntroStep(introStep - 1)} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.9rem' }}>
                  Back
                </button>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[0, 1, 2, 3].map(st => (
                <div key={st} style={{ width: '8px', height: '8px', borderRadius: '50%', background: st === introStep ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)', transition: 'background 0.3s' }} />
              ))}
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleNextIntroStep} className="btn" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                {introStep === 3 ? 'Get Started' : 'Next'} {introStep === 3 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Standard Landing Page (After Intro or Auto-Skipped for Returners)
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>

      {/* Floating Back to Intro Button */}
      <button
        type="button"
        onClick={() => { setIntroStep(0); setHasSeenIntro(false); }}
        style={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          padding: '12px 24px',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--text-main)',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 50
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.25)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'; }}
      >
        <ArrowLeft size={18} />
        Back to Introduction
      </button>

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

          <div className="flex flex-col" style={{ gap: '3rem', marginTop: '2rem' }}>
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
                <h2 className="mb-6 text-center" style={{ fontSize: '1.8rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: 'var(--radius-full)' }}>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-full)', background: !isLogin ? 'var(--primary-color)' : 'transparent', border: 'none', color: !isLogin ? '#fff' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer', transition: 'var(--transition)' }}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-full)', background: isLogin ? 'var(--primary-color)' : 'transparent', border: 'none', color: isLogin ? '#fff' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer', transition: 'var(--transition)' }}
                  >
                    Log In
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

                {/* Removed toggle text link at the bottom since we have buttons at the top now */}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
