import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { venues, editVenue } from '../data/venues';
import { MapPin, Users, CheckCircle, TrendingUp, Pencil, Check, X, Camera } from 'lucide-react';

export const VenueDashboard: React.FC = () => {
  const { state, setUserName } = useAppContext();
  const [dbUsers, setDbUsers] = useState<any[]>([]);

  const myVenue = useMemo(() => {
    if (!state.venueId) return null;
    return venues.find((v) => v.id === state.venueId) || null;
  }, [state.venueId]);

  const [localVenue, setLocalVenue] = useState(myVenue);
  useEffect(() => { setLocalVenue(myVenue); }, [myVenue]);

  const [editingField, setEditingField] = useState<'photo' | 'name' | 'address' | 'description' | 'keywords' | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editKeywords, setEditKeywords] = useState('');

  const startEditing = (field: 'photo' | 'name' | 'address' | 'description' | 'keywords') => {
    if (!localVenue) return <div>Loading...</div>;
    if (field === 'name') setEditName(localVenue.name);
    if (field === 'description') setEditDesc(localVenue.description);
    if (field === 'photo') setEditImage(localVenue.imageUrl);
    if (field === 'address') setEditAddress(localVenue.address);
    if (field === 'keywords') setEditKeywords(localVenue.keywords.join(', '));
    setEditingField(field);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveField = async (field: 'photo' | 'name' | 'address' | 'description' | 'keywords') => {
    if (!localVenue) return;

    let updates: any = {};
    if (field === 'name') updates.name = editName;
    if (field === 'description') updates.description = editDesc;
    if (field === 'photo') updates.imageUrl = editImage;
    if (field === 'address') updates.address = editAddress;
    if (field === 'keywords') {
      updates.keywords = editKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    }

    const updated = await editVenue(localVenue.id, updates);
    if (updated) {
      setLocalVenue(updated);

      // Update AppContext if needed
      if (field === 'name' && state.role === 'venue' && state.venueId === localVenue.id) {
        setUserName(editName);
      }
    }
    setEditingField(null);
  };

  // Fetch real users from DB to count members
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        const users = await response.json();
        setDbUsers(users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  // Calculate real stats
  const totalMembers = useMemo(() => {
    if (!myVenue) return 0;
    // Count athletes who have checked in or joined this venue's club
    return dbUsers.filter(u =>
      u.role === 'athlete' && (
        (u.checkIns || []).some((c: any) => c.venueId === myVenue.id) ||
        (u.joinedClubs || []).includes(myVenue.id)
      )
    ).length;
  }, [dbUsers, myVenue]);

  const totalCheckIns = useMemo(() => {
    if (!myVenue) return 0;
    return dbUsers.reduce((sum, u) => {
      return sum + (u.checkIns || []).filter((c: any) => c.venueId === myVenue.id).length;
    }, 0);
  }, [dbUsers, myVenue]);

  if (!myVenue) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl mb-2">Venue not found</h2>
        <p className="text-muted">Your venue listing could not be loaded.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="mb-8">
        <h1 className="text-2xl mb-1">
          <span className="text-gradient">Venue Dashboard</span>
        </h1>
        <p className="text-sm text-muted">Manage your listing on VibeFit</p>
      </div>

      {/* 1. Profile Photo Card */}
      <div className="card mb-6" style={{ padding: '20px' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg m-0" style={{ margin: 0 }}>Cover Photo</h2>
          {editingField !== 'photo' && (
            <button onClick={() => startEditing('photo')} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              <Pencil size={12} /> Edit
            </button>
          )}
        </div>
        {editingField === 'photo' ? (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div style={{ width: '120px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={editImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <label className="btn btn-secondary inline-flex items-center gap-2" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.85rem' }}>
                <Camera size={16} /> Upload New Photo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary" onClick={() => setEditingField(null)}><X size={16} /> Cancel</button>
              <button className="btn btn-primary" onClick={() => handleSaveField('photo')}><Check size={16} /> Save</button>
            </div>
          </div>
        ) : (
          <div style={{ height: '150px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <img src={localVenue.imageUrl} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      {/* 2. Venue Name Card */}
      <div className="card mb-6" style={{ padding: '20px' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg m-0" style={{ margin: 0 }}>Venue Name</h2>
          {editingField !== 'name' && (
            <button onClick={() => startEditing('name')} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              <Pencil size={12} /> Edit
            </button>
          )}
        </div>
        {editingField === 'name' ? (
          <div>
            <input type="text" className="input mb-4" value={editName} onChange={e => setEditName(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary" onClick={() => setEditingField(null)}><X size={16} /> Cancel</button>
              <button className="btn btn-primary" onClick={() => handleSaveField('name')}><Check size={16} /> Save</button>
            </div>
          </div>
        ) : (
          <div className="text-xl font-bold">{localVenue.name}</div>
        )}
      </div>

      {/* 3. Address Card */}
      <div className="card mb-6" style={{ padding: '20px' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg m-0" style={{ margin: 0 }}>Address</h2>
          {editingField !== 'address' && (
            <button onClick={() => startEditing('address')} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              <Pencil size={12} /> Edit
            </button>
          )}
        </div>
        {editingField === 'address' ? (
          <div>
            <input type="text" className="input mb-4" value={editAddress} onChange={e => setEditAddress(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary" onClick={() => setEditingField(null)}><X size={16} /> Cancel</button>
              <button className="btn btn-primary" onClick={() => handleSaveField('address')}><Check size={16} /> Save</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted"><MapPin size={16} /> {localVenue.address}</div>
        )}
      </div>

      {/* 4. Description Card */}
      <div className="card mb-6" style={{ padding: '20px' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg m-0" style={{ margin: 0 }}>Description</h2>
          {editingField !== 'description' && (
            <button onClick={() => startEditing('description')} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              <Pencil size={12} /> Edit
            </button>
          )}
        </div>
        {editingField === 'description' ? (
          <div>
            <textarea className="input mb-4" style={{ minHeight: '100px', resize: 'vertical' }} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary" onClick={() => setEditingField(null)}><X size={16} /> Cancel</button>
              <button className="btn btn-primary" onClick={() => handleSaveField('description')}><Check size={16} /> Save</button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted" style={{ whiteSpace: 'pre-wrap' }}>{localVenue.description}</div>
        )}
      </div>

      {/* 5. Keywords Card */}
      <div className="card mb-6" style={{ padding: '20px' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg m-0" style={{ margin: 0 }}>Vibe Keywords</h2>
          {editingField !== 'keywords' && (
            <button onClick={() => startEditing('keywords')} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              <Pencil size={12} /> Edit
            </button>
          )}
        </div>
        {editingField === 'keywords' ? (
          <div>
            <label className="block text-xs font-bold text-muted mb-1">Comma separated</label>
            <input type="text" className="input mb-4" value={editKeywords} onChange={e => setEditKeywords(e.target.value)} placeholder="e.g. friendly, pro-level, cardio" />
            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary" onClick={() => setEditingField(null)}><X size={16} /> Cancel</button>
              <button className="btn btn-primary" onClick={() => handleSaveField('keywords')}><Check size={16} /> Save</button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {localVenue.keywords.map((kw) => (
              <span key={kw} className="badge" style={{ padding: '4px 10px' }}>{kw}</span>
            ))}
          </div>
        )}
      </div>

      {/* Stats Grid — Real data only */}
      <div className="grid-cards mb-6" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="card text-center p-4">
          <Users size={24} color="var(--primary-color)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>{totalMembers}</div>
          <div className="text-xs text-muted mt-1 uppercase tracking-wider font-bold">Members</div>
        </div>
        <div className="card text-center p-4">
          <CheckCircle size={24} color="var(--success-color)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold" style={{ color: 'var(--success-color)' }}>{totalCheckIns}</div>
          <div className="text-xs text-muted mt-1 uppercase tracking-wider font-bold">Check-ins</div>
        </div>
      </div>

      {/* Features */}
      <div className="card mb-6">
        <h3 className="text-md mb-3">Listing Features</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} color={myVenue.acceptsMultisport ? 'var(--success-color)' : 'var(--text-muted)'} />
            <span style={{ color: myVenue.acceptsMultisport ? 'var(--text-main)' : 'var(--text-muted)' }}>
              Accepts Multisport Card {!myVenue.acceptsMultisport && '(disabled)'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} color={myVenue.freeSession ? 'var(--success-color)' : 'var(--text-muted)'} />
            <span style={{ color: myVenue.freeSession ? 'var(--text-main)' : 'var(--text-muted)' }}>
              Free Trial Session {!myVenue.freeSession && '(disabled)'}
            </span>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="card" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div className="flex items-start gap-3">
          <TrendingUp size={20} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 className="text-sm font-bold mb-1">Boost your visibility</h4>
            <p className="text-xs text-muted">
              Athletes discover your venue based on keyword matching. Make sure your keywords accurately reflect your training style and atmosphere to attract the right members!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
