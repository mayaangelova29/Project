import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentLocation } from '../utils/geolocation';
import { useAppContext } from '../context/AppContext';
import { MapPin, ArrowRight, ArrowLeft, Loader } from 'lucide-react';

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

  const finalizeOnboarding = async (traits: string[]) => {
    setLoading(true);

    const markOnboardedInDb = async () => {
      if (state.email) {
        try {
          const res = await fetch(`http://localhost:3001/users?email=${state.email}`);
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
      setGpsError("We need your location to find nearby venues.");
      // Fallback to absolute center of Sofia for demonstration if declined
      const fallBackCoords = { lat: 42.6977, lng: 23.3219 }; 
      setUserCoords(fallBackCoords);
      await markOnboardedInDb();
      setOnboarded(true);
      setTimeout(() => navigate('/app'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container justify-center items-center">
        <Loader className="animate-spin mb-4" size={48} color="var(--primary-color)" />
        <h2 className="text-center">Analyzing Your Vibe...</h2>
        <p className="text-muted mt-2 text-center">Finding your perfect match</p>
        {gpsError && (
          <div className="badge mt-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
            {gpsError} (Using default city center)
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
