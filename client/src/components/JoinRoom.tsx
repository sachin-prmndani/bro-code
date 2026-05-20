import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';
import '../css/arenaField.css';

function JoinRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [handle, setHandle] = useState('');
  const [phase, setPhase] = useState<'join' | 'waiting' | 'error'>('join');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    socket.on('battle_start', ({ problem, roomId: rId, players }) => {
      navigate(`/room/${rId}/battle`, {
        state: { problem, players, handle },
      });
    });

    socket.on('error', ({ message }: { message: string }) => {
      setErrorMsg(message);
      setPhase('error');
    });

    return () => {
      socket.off('battle_start');
      socket.off('error');
    };
  }, [navigate, handle]);

  const handleJoin = () => {
    if (!handle.trim() || !roomId) return;
    socket.emit('join_room', { roomId, handle: handle.trim() });
    setPhase('waiting');
  };

  if (phase === 'waiting') {
    return (
      <div className="arena-page">
        <div className="arena-content">
          <h1 className="arena-title">⚔ JOINED ROOM {roomId} ⚔</h1>
          <div className="arena-card" style={{ textAlign: 'center' }}>
            <div className="waiting-pulse">● FETCHING BATTLE PROBLEM...</div>
            <p className="arena-subtitle" style={{ marginTop: '1rem' }}>
              GET READY<span className="blink">_</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="arena-page">
        <div className="arena-content">
          <h1 className="arena-title">⚠ ERROR</h1>
          <div className="arena-card" style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ color: '#ff4444' }}>▶ {errorMsg}</div>
            <button className="submit-btn" type="button" onClick={() => setPhase('join')} style={{ marginTop: '2rem' }}>
              ▶ TRY AGAIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="arena-page">
      <div className="arena-content">
        <h1 className="arena-title">⚔ JOIN ROOM ⚔</h1>
        <p className="arena-subtitle">ROOM ID: {roomId}<span className="blink">_</span></p>

        <div className="arena-card">
          <div className="section-label">▶ YOUR HANDLE</div>
          <div className="players-row">
            <div>
              <div className="player-badge p2-badge">◆ Player 2</div>
              <input
                className="pixel-input"
                type="text"
                placeholder="enter CF handle"
                value={handle}
                onChange={e => setHandle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
              />
            </div>
          </div>

          <button className="submit-btn" type="button" onClick={handleJoin} style={{ marginTop: '2rem' }}>
            ▶ JOIN BATTLE
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
