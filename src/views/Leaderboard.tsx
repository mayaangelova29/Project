import React, { useMemo } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Mock other users on the leaderboard for demonstration
const mockUsers = [
  { id: '1', name: 'Alex K.', points: 15400, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Maria S.', points: 12200, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Ivan D.', points: 9800, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Georgi T.', points: 8500, avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Elena V.', points: 7100, avatar: 'https://i.pravatar.cc/150?u=5' },
];

export const Leaderboard: React.FC = () => {
  const { state } = useAppContext();

  // Insert the current user into the global leaderboard
  const combinedLeaderboard = useMemo(() => {
    const list = [...mockUsers, { id: 'me', name: 'You', points: state.points, avatar: 'https://i.pravatar.cc/150?u=me' }];
    return list.sort((a, b) => b.points - a.points);
  }, [state.points]);

  const currentUserRank = combinedLeaderboard.findIndex(u => u.id === 'me') + 1;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="text-center mb-8">
        <Trophy size={48} color="#f59e0b" className="mx-auto mb-4" />
        <h1 className="text-2xl mb-1">Top Athletes</h1>
        <p className="text-muted text-sm">Monthly Global Leaderboard</p>
      </div>

      {/* Current User Stats Bar */}
      <div className="card mb-8" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.1))', borderColor: 'var(--primary-color)' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-color)', overflow: 'hidden', border: '2px solid var(--primary-color)' }}>
              <img src="https://i.pravatar.cc/150?u=me" alt="You" style={{ width: '100%' }} />
            </div>
            <div>
              <div className="font-bold">Your Rank: #{currentUserRank}</div>
              <div className="text-sm" style={{ color: 'var(--primary-color)' }}>{state.points} Pts</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted mb-1">Check-ins</div>
            <div className="font-bold flex items-center justify-end gap-1"><Star size={14} color="var(--accent-color)" /> {state.checkIns.length}</div>
          </div>
        </div>
      </div>

      <h3 className="text-sm text-muted uppercase tracking-wider mb-4">Top 10 This Month</h3>

      <div className="flex flex-col gap-3">
        {combinedLeaderboard.map((user, index) => {
          const isCurrentUser = user.id === 'me';
          let borderStyle = '1px solid rgba(255,255,255,0.05)';
          if (isCurrentUser) borderStyle = '1px solid var(--primary-color)';

          return (
            <div 
              key={user.id} 
              className="card flex items-center p-3" 
              style={{ border: borderStyle, background: isCurrentUser ? 'rgba(99,102,241,0.1)' : undefined }}
            >
              <div style={{ width: '30px', fontWeight: 'bold', color: index < 3 ? '#f59e0b' : 'var(--text-muted)' }}>
                {index === 0 && <Medal size={20} color="#f59e0b" />}
                {index === 1 && <Medal size={20} color="#94a3b8" />}
                {index === 2 && <Medal size={20} color="#b45309" />}
                {index > 2 && `#${index + 1}`}
              </div>
              
              <img src={user.avatar} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%', margin: '0 12px' }} />
              
              <div className="flex-1 font-bold">
                {user.name}
              </div>
              
              <div className="font-mono text-sm">
                {user.points.toLocaleString()} pts
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};
