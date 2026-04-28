import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User, Lock, Mail, BrainCircuit, Trophy, MapPin, LogOut, ArrowRight, CheckCircle2, ArrowLeft, Building2, Dumbbell } from 'lucide-react';
import { venues as venueList } from '../data/venues';

// Category-to-image mapping for venue registration defaults
const CATEGORY_IMAGES: Record<string, string> = {
  'Gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  'Fight Club': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80',
  'Dance Studio': 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=800&q=80',
  'Yoga': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  'Swimming': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
  'Tennis / Padel': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80',
  'Climbing': 'https://cdn.walltopia.com/wp-content/uploads/20231030104515/Image-2-8.jpg',
  'CrossFit': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  'Folklore Dance': 'https://time4.dance/ads/FB-post-image-narodni-tanci.jpg?ver=1',
  'Other': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
};

const ALL_KEYWORDS = ['intense', 'relaxed', 'community-focused', 'strict', 'pro-level', 'beginner-friendly', 'friendly', 'fast-paced', 'technique-focused', 'cardio', 'clean', 'sparring'];

export const Landing: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'athlete' | 'venue' | null>(null);
  const { state, setAuthenticated, setOnboarded, resetState } = useAppContext();
  const navigate = useNavigate();

  // Venue registration fields
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueDescription, setVenueDescription] = useState('');
  const [venueCategory, setVenueCategory] = useState('Gym');
  const [venueKeywords, setVenueKeywords] = useState<string[]>([]);
  const [acceptsMultisport, setAcceptsMultisport] = useState(false);
  const [freeSession, setFreeSession] = useState(false);

  // Intro state
  const [hasSeenIntro, setHasSeenIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0);

  useEffect(() => {
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

  const toggleKeyword = (kw: string) => {
    setVenueKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );
  };

  // Athlete login/signup
  const handleAthleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (email && password) {
        try {
          const response = await fetch(`http://localhost:3001/users?email=${email}`);
          const users = await response.json();
          const user = users[0];

          if (user) {
            if (user.password === password) {
              setAuthenticated(true, user.name, user.email);
              // Set role in state
              const appState = JSON.parse(localStorage.getItem('vibefit_state') || '{}');
              appState.role = user.role || 'athlete';
              appState.venueId = user.venueId || null;
              appState.isAuthenticated = true;
              appState.userName = user.name;
              appState.email = user.email;
              localStorage.setItem('vibefit_state', JSON.stringify(appState));

              if (user.role === 'venue') {
                // Venue login — reload to pick up state
                window.location.href = '/venue-dashboard';
              } else if (user.hasOnboarded) {
                setOnboarded(true);
                navigate('/app');
              } else {
                navigate('/onboarding');
              }
            } else {
              alert('Incorrect password');
            }
          } else {
            alert('User not found. Please sign up.');
          }
        } catch (error) {
          console.error("Login failed", error);
          alert('Could not connect to database.');
        }
      }
    } else {
      if (name && email && password) {
        try {
          const checkRes = await fetch(`http://localhost:3001/users?email=${email}`);
          const existingUsers = await checkRes.json();
          if (existingUsers.length > 0) {
            alert('User already exists with this email.');
            return;
          }

          const newUser = { email, name, password, hasOnboarded: false, points: 0, checkIns: [], role: 'athlete' };
          await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
          });

          setAuthenticated(true, name, email);
          navigate('/onboarding');
        } catch (error) {
          console.error("Sign up failed", error);
          alert('Could not connect to database.');
        }
      }
    }
  };

  // Venue registration
  const handleVenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!venueName || !email || !password || !venueAddress) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const checkRes = await fetch(`http://localhost:3001/users?email=${email}`);
      const existingUsers = await checkRes.json();
      if (existingUsers.length > 0) {
        alert('An account already exists with this email.');
        return;
      }

      // Generate a unique venue ID
      const newVenueId = 'v' + Date.now();

      // Create user account for the venue
      const newUser = {
        email,
        name: venueName,
        password,
        hasOnboarded: true,
        points: 0,
        checkIns: [],
        role: 'venue',
        venueId: newVenueId,
      };
      await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      // Add venue to runtime list
      const imageUrl = CATEGORY_IMAGES[venueCategory] || CATEGORY_IMAGES['Other'];
      const newVenue = {
        id: newVenueId,
        name: venueName,
        lat: 42.6977 + (Math.random() - 0.5) * 0.05,
        lng: 23.3219 + (Math.random() - 0.5) * 0.05,
        address: venueAddress,
        keywords: venueKeywords.length > 0 ? venueKeywords : ['friendly', 'clean'],
        rating: 5.0,
        reviewCount: 0,
        acceptsMultisport,
        freeSession,
        imageUrl,
        description: venueDescription || `${venueName} — a new ${venueCategory.toLowerCase()} on VibeFit.`,
      };
      venueList.push(newVenue as any);

      // Set state and navigate
      const appState = {
        isAuthenticated: true,
        userName: venueName,
        email,
        profilePhoto: null,
        hasOnboarded: true,
        userCoords: null,
        userKeywords: [],
        checkIns: [],
        points: 0,
        joinedClubs: [],
        role: 'venue' as const,
        venueId: newVenueId,
      };
      localStorage.setItem('vibefit_state', JSON.stringify(appState));
      window.location.href = '/venue-dashboard';
    } catch (error) {
      console.error("Venue registration failed", error);
      alert('Could not connect to database.');
    }
  };

  // --- RENDERING --- //

  // 1. Intro Carousel
  if (!state.isAuthenticated && !hasSeenIntro) {
    const introSlides = [
      { title: "Find the Gym Where You Actually Belong.", desc: "Don't guess where to work out. VibeFit uses a rapid psychological and physical preference quiz to match your unique vibe strictly with the culture, style, and intensity of nearby sports venues.", icon: null },
      { title: "Psychological Matching", desc: "Answer a 7-step profile analyzer to map your workout intensity and preferred social atmosphere.", icon: <BrainCircuit size={64} color="var(--primary-color)" /> },
      { title: "Location-Aware Intelligence", desc: "We rank venues strictly within a 10km GPS radius using a powerful 60/40 algorithm blending Match % and proximity.", icon: <MapPin size={64} color="var(--accent-color)" /> },
      { title: "Gamify Your Consistency", desc: "Check in at locations, earn 100 points per visit, and compete on our global monthly athlete Leaderboard.", icon: <Trophy size={64} color="#f59e0b" /> }
    ];
    const slide = introSlides[introStep];

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '24px' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '48px', textAlign: 'center' }}>VibeFit</h1>
        <div key={introStep} className="card animate-intro" style={{ maxWidth: '600px', width: '100%', padding: '48px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '400px', justifyContent: 'center', background: 'rgba(56, 189, 248, 0.25)', border: '1px solid rgba(56, 189, 248, 0.4)', boxShadow: '0 8px 32px rgba(56, 189, 248, 0.25)', backdropFilter: 'blur(20px)' }}>
          <div style={{ marginBottom: '32px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {slide.icon ? <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '50%' }}>{slide.icon}</div> : <BrainCircuit size={80} color="var(--primary-color)" style={{ opacity: 0.8 }} />}
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '16px' }}>{slide.title}</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '48px', lineHeight: '1.6' }}>{slide.desc}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              {introStep > 0 && <button onClick={() => setIntroStep(introStep - 1)} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.9rem' }}>Back</button>}
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[0, 1, 2, 3].map(st => <div key={st} style={{ width: '8px', height: '8px', borderRadius: '50%', background: st === introStep ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)', transition: 'background 0.3s' }} />)}
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

  // 2. Main Landing
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>

      {/* Back to Intro */}
      <button type="button" onClick={() => { setIntroStep(0); setHasSeenIntro(false); }}
        style={{ position: 'absolute', top: '32px', left: '32px', padding: '12px 24px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', zIndex: 50 }}
      >
        <ArrowLeft size={18} /> Back to Introduction
      </button>

      <div style={{ width: '100%', maxWidth: '1200px', padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center' }}>

        {/* Left: Pitch */}
        <div style={{ flex: '1 1 400px' }}>
          <h1 className="text-gradient" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '16px' }}>VibeFit</h1>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '24px' }}>Find the Gym Where You Actually Belong.</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
            Don't guess where to work out. VibeFit uses a rapid psychological and physical preference quiz to match your unique <strong>"vibe"</strong> strictly with the culture, style, and intensity of nearby sports venues.
          </p>
          <div className="flex flex-col" style={{ gap: '3rem', marginTop: '2rem' }}>
            <div className="flex items-start gap-4">
              <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '12px', borderRadius: 'var(--radius-md)' }}><BrainCircuit size={24} color="var(--primary-color)" /></div>
              <div><h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Psychological Matching</h4><p className="text-muted text-sm" style={{ margin: 0 }}>Answer a 7-step profile analyzer to map your workout intensity and preferred social atmosphere.</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '12px', borderRadius: 'var(--radius-md)' }}><MapPin size={24} color="var(--accent-color)" /></div>
              <div><h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Location-Aware Intelligence</h4><p className="text-muted text-sm" style={{ margin: 0 }}>We rank venues within your GPS radius using a powerful 60/40 algorithm blending Match % and proximity.</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: 'var(--radius-md)' }}><Trophy size={24} color="#f59e0b" /></div>
              <div><h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Gamify Your Consistency</h4><p className="text-muted text-sm" style={{ margin: 0 }}>Check in at locations, earn 100 points per visit, and compete on our global monthly athlete Leaderboard.</p></div>
            </div>
          </div>
        </div>

        {/* Right: Auth */}
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '40px 32px', background: 'rgba(30, 41, 59, 0.7)' }}>

            {/* Already logged in */}
            {state.isAuthenticated && state.userName ? (
              <div className="text-center">
                <h2 className="mb-4" style={{ fontSize: '1.8rem' }}>Welcome Back, {state.userName}!</h2>
                <p className="text-muted mb-8">You're already logged in.</p>
                <button onClick={() => navigate(state.role === 'venue' ? '/venue-dashboard' : (state.hasOnboarded ? '/app' : '/onboarding'))} className="btn w-full mb-4" style={{ fontSize: '1.1rem', padding: '16px 24px' }}>
                  Enter Dashboard
                </button>
                <button onClick={() => resetState()} className="btn-secondary w-full" style={{ fontSize: '1rem', padding: '12px 24px', display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <LogOut size={18} /> Switch Account
                </button>
              </div>
            ) : (
              <>
                {/* Role Selector (only for sign-up) */}
                {!isLogin && !selectedRole && (
                  <div>
                    <h2 className="mb-6 text-center" style={{ fontSize: '1.6rem' }}>I am a...</h2>
                    <div className="flex flex-col gap-4">
                      <button
                        className="card"
                        style={{ cursor: 'pointer', padding: '24px', textAlign: 'center', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', transition: 'all 0.2s' }}
                        onClick={() => setSelectedRole('athlete')}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <Dumbbell size={40} color="var(--primary-color)" className="mx-auto mb-3" />
                        <h3 style={{ margin: '0 0 4px 0' }}>Athlete / Person</h3>
                        <p className="text-xs text-muted">I want to discover and join training facilities</p>
                      </button>
                      <button
                        className="card"
                        style={{ cursor: 'pointer', padding: '24px', textAlign: 'center', border: '1px solid rgba(56,189,248,0.3)', background: 'rgba(56,189,248,0.08)', transition: 'all 0.2s' }}
                        onClick={() => setSelectedRole('venue')}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <Building2 size={40} color="var(--accent-color)" className="mx-auto mb-3" />
                        <h3 style={{ margin: '0 0 4px 0' }}>Venue / Facility</h3>
                        <p className="text-xs text-muted">I want to list my gym, club, or studio on VibeFit</p>
                      </button>
                    </div>
                    <p className="text-center text-muted text-sm mt-6">
                      Already have an account?{' '}
                      <button onClick={() => setIsLogin(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}>
                        Log In
                      </button>
                    </p>
                  </div>
                )}

                {/* Login Form (works for both roles) */}
                {isLogin && (
                  <div>
                    <h2 className="mb-6 text-center" style={{ fontSize: '1.8rem' }}>Welcome Back</h2>
                    <form onSubmit={handleAthleteSubmit} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Email</label>
                        <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <Mail size={20} className="text-muted" />
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '1rem' }} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Password</label>
                        <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <Lock size={20} className="text-muted" />
                          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '1rem' }} />
                        </div>
                      </div>
                      <button type="submit" className="btn w-full mt-4" style={{ fontSize: '1.1rem', padding: '16px 24px' }}>Sign In</button>
                    </form>
                    <p className="text-center text-muted text-sm mt-6">
                      Don't have an account?{' '}
                      <button onClick={() => { setIsLogin(false); setSelectedRole(null); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}>
                        Sign Up
                      </button>
                    </p>
                  </div>
                )}

                {/* Athlete Sign Up */}
                {!isLogin && selectedRole === 'athlete' && (
                  <div>
                    <button onClick={() => setSelectedRole(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, marginBottom: '16px', fontSize: '0.9rem' }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <h2 className="mb-6 text-center" style={{ fontSize: '1.6rem' }}>Create Athlete Account</h2>
                    <form onSubmit={handleAthleteSubmit} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Name</label>
                        <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <User size={20} className="text-muted" />
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '1rem' }} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Email</label>
                        <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <Mail size={20} className="text-muted" />
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '1rem' }} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Password</label>
                        <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <Lock size={20} className="text-muted" />
                          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '1rem' }} />
                        </div>
                      </div>
                      <button type="submit" className="btn w-full mt-4" style={{ fontSize: '1.1rem', padding: '16px 24px' }}>Sign Up</button>
                    </form>
                  </div>
                )}

                {/* Venue Registration */}
                {!isLogin && selectedRole === 'venue' && (
                  <div>
                    <button onClick={() => setSelectedRole(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, marginBottom: '16px', fontSize: '0.9rem' }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <h2 className="mb-4 text-center" style={{ fontSize: '1.5rem' }}>Register Your Venue</h2>
                    <p className="text-center text-muted text-sm mb-6">List your facility and let athletes discover you</p>
                    <form onSubmit={handleVenueSubmit} className="flex flex-col gap-4">
                      {/* Venue Name */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Venue Name *</label>
                        <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="e.g. Iron Temple Gym" required
                          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                      </div>
                      {/* Email */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Email *</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="venue@example.com" required
                          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                      </div>
                      {/* Password */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Password *</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                      </div>
                      {/* Address */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Address *</label>
                        <input type="text" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} placeholder="123 Main St., Sofia" required
                          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                      </div>
                      {/* Category */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Category</label>
                        <select value={venueCategory} onChange={(e) => setVenueCategory(e.target.value)}
                          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}>
                          {Object.keys(CATEGORY_IMAGES).map((cat) => <option key={cat} value={cat} style={{ background: '#1e293b' }}>{cat}</option>)}
                        </select>
                      </div>
                      {/* Description */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Description</label>
                        <textarea value={venueDescription} onChange={(e) => setVenueDescription(e.target.value)} placeholder="Tell athletes what makes your venue special..." rows={3}
                          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                      </div>
                      {/* Keywords */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted uppercase font-bold tracking-wider">Vibe Keywords (select all that apply)</label>
                        <div className="flex gap-2 flex-wrap" style={{ marginTop: '4px' }}>
                          {ALL_KEYWORDS.map((kw) => (
                            <button key={kw} type="button" onClick={() => toggleKeyword(kw)}
                              className="badge"
                              style={{
                                cursor: 'pointer',
                                padding: '6px 12px',
                                background: venueKeywords.includes(kw) ? 'var(--primary-color)' : 'transparent',
                                color: venueKeywords.includes(kw) ? '#fff' : 'var(--text-muted)',
                                borderColor: venueKeywords.includes(kw) ? 'transparent' : 'rgba(255,255,255,0.15)',
                                transition: 'all 0.2s',
                              }}
                            >
                              {kw}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Toggles */}
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm" style={{ cursor: 'pointer' }}>
                          <input type="checkbox" checked={acceptsMultisport} onChange={(e) => setAcceptsMultisport(e.target.checked)} style={{ accentColor: 'var(--primary-color)' }} />
                          Accepts Multisport
                        </label>
                        <label className="flex items-center gap-2 text-sm" style={{ cursor: 'pointer' }}>
                          <input type="checkbox" checked={freeSession} onChange={(e) => setFreeSession(e.target.checked)} style={{ accentColor: 'var(--primary-color)' }} />
                          Free Trial Session
                        </label>
                      </div>
                      <button type="submit" className="btn w-full mt-2" style={{ fontSize: '1.05rem', padding: '14px 24px', background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))' }}>
                        <Building2 size={20} /> Register Venue
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
