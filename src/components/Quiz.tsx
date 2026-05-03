import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentLocation, geocodeAddress, NominatimResult } from '../utils/geolocation';
import { useAppContext } from '../context/AppContext';
import { MapPin, ArrowRight, ArrowLeft, Loader, Search, MapPinned } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    question: "What's your preferred workout environment?",
    options: [
      { text: "Loud, high-energy, pumping music", traits: ["intense", "fast-paced"] },
      { text: "Quiet, focused, and disciplined", traits: ["strict", "technique-focused"] },
      { text: "Friendly, chatter, and supportive", traits: ["friendly", "community-focused"] },
      { text: "Zen, clean, and peaceful", traits: ["relaxed", "clean"] },
    ]
  },
  {
    question: "How do you feel about physical contact in sports?",
    options: [
      { text: "I love it, bring on the sparring!", traits: ["sparring", "intense"] },
      { text: "Only light contact is fine", traits: ["beginner-friendly", "technique-focused"] },
      { text: "No contact, I prefer my own space", traits: ["cardio", "clean"] },
      { text: "I want to move together without touching", traits: ["fast-paced", "cardio"] },
    ]
  },
  {
    question: "What kind of coach motivates you best?",
    options: [
      { text: "A strict drill sergeant who pushes my limits", traits: ["strict", "pro-level"] },
      { text: "A technical geek who fixes my form", traits: ["technique-focused"] },
      { text: "An energetic cheerleader making it fun", traits: ["friendly", "fast-paced"] },
      { text: "A chilled guide who lets me flow", traits: ["relaxed"] },
    ]
  },
  {
    question: "What's your current experience level with fitness?",
    options: [
      { text: "Just starting out, need guidance", traits: ["beginner-friendly", "friendly"] },
      { text: "I work out occasionally", traits: ["relaxed", "cardio"] },
      { text: "I'm a regular, looking for a challenge", traits: ["intense", "community-focused"] },
      { text: "I'm a pro/competitor", traits: ["pro-level", "sparring"] },
    ]
  },
  {
    question: "When things get tough in a workout, you...",
    options: [
      { text: "Bite down on my mouthpiece and go harder", traits: ["intense", "sparring"] },
      { text: "Rely on the team to pull me through", traits: ["community-focused", "friendly"] },
      { text: "Focus entirely on my breathing to calm down", traits: ["relaxed", "technique-focused"] },
      { text: "Scale back so I can finish safely", traits: ["beginner-friendly", "clean"] },
    ]
  },
  {
    question: "What role does music play for you?",
    options: [
      { text: "Essential. It dictates the rhythm", traits: ["fast-paced", "cardio"] },
      { text: "Good background noise", traits: ["community-focused"] },
      { text: "I prefer silence or natural sounds", traits: ["relaxed", "strict"] },
      { text: "I don't even hear it when I'm in the zone", traits: ["pro-level", "intense"] },
    ]
  },
  {
    question: "Final question: What's your primary goal?",
    options: [
      { text: "Learn self-defense and fight skills", traits: ["sparring", "strict"] },
      { text: "Burn maximum calories and sweat", traits: ["cardio", "fast-paced"] },
      { text: "Find a tribe and make friends", traits: ["community-focused", "friendly"] },
      { text: "Master a complex physical skill", traits: ["technique-focused", "pro-level"] },
      { text: "Just feel better physically and mentally", traits: ["relaxed", "clean", "beginner-friendly"] },
    ]
  }
];

export const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Manual location state
  const [manualAddress, setManualAddress] = useState('');
  const [geocodeResults, setGeocodeResults] = useState<NominatimResult[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { setUserKeywords, setUserCoords, setOnboarded, state } = useAppContext();
  const navigate = useNavigate();

  const handleOptionSelect = (traits: string[]) => {
    const nextTraits = [...selectedTraits, ...traits];
    
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setSelectedTraits(nextTraits);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete, assemble profile and request GPS
      setSelectedTraits(nextTraits);
      finalizeOnboarding(nextTraits);
    }
  };

  const markOnboardedInDb = async () => {
    if (state.email) {
      try {
        const cleanEmail = state.email.trim().toLowerCase();
        const res = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(cleanEmail)}`);
        const users = await res.json();
        if (users.length > 0) {
          await fetch(`http://localhost:3001/users/${users[0].id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hasOnboarded: true })
          });
        }
      } catch (error) {
        console.error("Failed to update onboarding status", error);
      }
    }
  };

  const finalizeOnboarding = async (traits: string[]) => {
    setLoading(true);

    try {
      // We deduplicate traits
      const uniqueTraits = Array.from(new Set(traits));
      setUserKeywords(uniqueTraits);

      // Attempt to get GPS
      const coords = await getCurrentLocation();
      setUserCoords(coords);
      await markOnboardedInDb();
      setOnboarded(true);
      navigate('/app');
    } catch (e) {
      console.error(e);
      setLoading(false);
      setGpsError("We couldn't automatically detect your location. Please enter your address manually.");
    }
  };

  const handleAddressChange = useCallback((value: string) => {
    setManualAddress(value);
    if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    if (value.length < 3) {
      setGeocodeResults([]);
      setShowSuggestions(false);
      return;
    }
    setIsGeocoding(true);
    geocodeTimerRef.current = setTimeout(async () => {
      const results = await geocodeAddress(value);
      setGeocodeResults(results);
      setShowSuggestions(results.length > 0);
      setIsGeocoding(false);
    }, 600);
  }, []);

  const selectGeocodeSuggestion = async (result: NominatimResult) => {
    setManualAddress(result.display_name);
    setShowSuggestions(false);
    setGeocodeResults([]);
    
    setLoading(true);
    setGpsError(null);
    
    const coords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setUserCoords(coords);
    await markOnboardedInDb();
    setOnboarded(true);
    navigate('/app');
  };

  if (loading || gpsError) {
    return (
      <div className="app-container justify-center items-center" style={{ padding: '24px' }}>
        {loading ? (
          <>
            <Loader className="animate-spin mb-4" size={48} color="var(--primary-color)" />
            <h2 className="text-center">Analyzing Your Vibe...</h2>
            <p className="text-muted mt-2 text-center">Finding your perfect match</p>
          </>
        ) : (
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px 24px', textAlign: 'center' }}>
            <MapPin size={48} color="var(--accent-color)" className="mx-auto mb-4" />
            <h2 className="text-xl mb-2">Location Required</h2>
            <p className="text-muted text-sm mb-6">{gpsError}</p>
            
            <div style={{ position: 'relative', textAlign: 'left' }}>
              <label className="text-xs text-muted uppercase font-bold tracking-wider mb-1 block">Your Address</label>
              <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {isGeocoding ? <Loader size={18} className="text-muted" style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={18} className="text-muted" />}
                <input 
                  type="text" 
                  value={manualAddress} 
                  onChange={(e) => handleAddressChange(e.target.value)} 
                  onFocus={() => { if (geocodeResults.length > 0) setShowSuggestions(true); }}
                  placeholder="e.g. Sofia, Bulgaria"
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '1rem' }} 
                />
              </div>

              {showSuggestions && geocodeResults.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: '4px',
                  background: 'rgba(30, 41, 59, 0.98)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.5)', overflow: 'hidden',
                  maxHeight: '240px', overflowY: 'auto',
                }}>
                  {geocodeResults.map((r) => (
                    <button key={r.place_id} type="button"
                      onClick={() => selectGeocodeSuggestion(r)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%',
                        padding: '12px 16px', background: 'transparent', border: 'none',
                        color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left',
                        fontSize: '0.85rem', lineHeight: '1.4', transition: 'background 0.15s',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <MapPinned size={16} style={{ color: 'var(--accent-color)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{r.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => {
                // Allow them to skip manually if they really want, using a fallback
                setLoading(true);
                setGpsError(null);
                const fallBackCoords = { lat: 42.6977, lng: 23.3219 }; 
                setUserCoords(fallBackCoords);
                markOnboardedInDb().then(() => {
                  setOnboarded(true);
                  navigate('/app');
                });
              }}
              className="mt-6 text-sm"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Skip & use default city center
            </button>
          </div>
        )}
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="app-container" style={{ padding: '24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', paddingTop: '5vh' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex justify-between items-center mb-8 mt-4">
          <div className="badge">Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Vibe Profile</div>
        </div>
      
      {/* Progress bar */}
      <div style={{ width: '100%', height: '4px', background: 'var(--surface-color)', borderRadius: '2px', marginBottom: '32px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '2px', transition: 'width 0.3s ease' }}></div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', lineHeight: 1.4 }}>{q.question}</h2>

      <div className="flex flex-col gap-4">
        {q.options.map((opt, i) => (
          <button 
            key={i} 
            className="card"
            style={{ 
              textAlign: 'left', 
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(30, 41, 59, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onClick={() => handleOptionSelect(opt.traits)}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary-color)')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}
          >
            <span>{opt.text}</span>
            <ArrowRight size={18} color="var(--primary-color)" />
          </button>
        ))}
      </div>
        
        {currentQuestion === QUIZ_QUESTIONS.length - 1 && (
          <p className="text-center text-muted mt-8 text-sm flex justify-center items-center gap-2">
            <MapPin size={14} /> We will request location access next
          </p>
        )}
      </div>
    </div>
  );
};
