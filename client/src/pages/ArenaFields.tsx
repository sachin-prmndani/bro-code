import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

import "../css/arenaField.css";

function createRoomId() {
  const characters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const nums = '0123456789'.split('');
  let roomId = '';
  for (let i = 0; i < 5; i++) {
    roomId += i & 1
      ? characters[Math.floor(Math.random() * characters.length)]
      : nums[Math.floor(Math.random() * nums.length)];
  }
  return roomId;
}

const roomID = createRoomId();

const CF_TAGS: string[] = [
  "2-sat", "binary search", "bitmasks", "brute force", "chinese remainder theorem",
  "combinatorics", "constructive algorithms", "data structures", "dfs and similar",
  "divide and conquer", "dp", "dsu", "expression parsing", "fft", "flows", "games",
  "geometry", "graph matchings", "graphs", "greedy", "hashing", "implementation",
  "interactive", "math", "matrices", "meet-in-the-middle", "number theory",
  "probabilities", "schedules", "shortest paths", "sliding window", "sortings",
  "string suffix structures", "strings", "ternary search", "trees", "two pointers"
];

interface ArenaFieldsProps {
  arenaName: string;
}

type Phase = 'setup' | 'waiting' | 'error';

function ArenaFields({ arenaName }: ArenaFieldsProps) {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [handle, setHandle] = useState('');
  const [ratingLeft, setRatingLeft] = useState('');
  const [ratingRight, setRatingRight] = useState('');
  const [phase, setPhase] = useState<Phase>('setup');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  useEffect(() => {
    // Once opponent joins, server emits battle_start → navigate to battle page
    socket.on('battle_start', ({ problem, roomId, players }) => {
      navigate(`/room/${roomId}/battle`, {
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

  const handleStartBattle = () => {
    if (!handle.trim()) return;

    const tags = [...selectedTags];
    const left = parseInt(ratingLeft) || 800;
    const right = parseInt(ratingRight) || 3500;

    socket.emit('create_room', {
      roomId: roomID,
      handle: handle.trim(),
      tags,
      ratingLeft: left,
      ratingRight: right,
    });

    setPhase('waiting');
  };

  // ── WAITING SCREEN ──
  if (phase === 'waiting') {
    return (
      <div className="arena-page">
        <div className="arena-content">
          <h1 className="arena-title">⚔ WAITING FOR OPPONENT ⚔</h1>
          <div className="arena-card" style={{ textAlign: 'center' }}>
            <div className="section-label">▶ ROOM ID</div>
            <div className="room-id-display">{roomID}</div>
            <p className="arena-subtitle" style={{ marginTop: '1rem' }}>
              Share this code with your opponent<span className="blink">_</span>
            </p>
            <div className="waiting-pulse">● WAITING FOR PLAYER 2...</div>
            <p style={{ color: 'var(--clr-dim, #555)', fontSize: '0.7rem', marginTop: '1.5rem' }}>
              Opponent joins at: <span style={{ color: 'var(--clr-green, #39ff14)' }}>/room/{roomID}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR SCREEN ──
  if (phase === 'error') {
    return (
      <div className="arena-page">
        <div className="arena-content">
          <h1 className="arena-title">⚠ ERROR</h1>
          <div className="arena-card" style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ color: '#ff4444' }}>▶ {errorMsg}</div>
            <button className="submit-btn" type="button" onClick={() => setPhase('setup')} style={{ marginTop: '2rem' }}>
              ▶ TRY AGAIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SETUP SCREEN ──
  return (
    <div className="arena-page">
      <div className="arena-content">
        <h1 className="arena-title">⚔ {arenaName} RoomID: {roomID} ⚔</h1>
        <p className="arena-subtitle">SELECT BATTLE SPECS<span className="blink">_</span></p>

        <div className="arena-card">
          {/* PLAYERS */}
          <div className="section-label">▶ PLAYERS</div>
          <div className="players-row">
            <div>
              <div className="player-badge p1-badge">◆ Your Handle</div>
              <input
                className="pixel-input"
                type="text"
                placeholder="enter handle"
                value={handle}
                onChange={e => setHandle(e.target.value)}
              />
            </div>
          </div>

          <hr className="card-divider" />

          {/* RATING */}
          <div className="section-label">▶ PROBLEM RATING</div>
          <div className="rating-row">
            <input
              className="pixel-input"
              type="number"
              placeholder="MIN  800"
              value={ratingLeft}
              onChange={e => setRatingLeft(e.target.value)}
            />
            <div className="rating-sep">TO</div>
            <input
              className="pixel-input"
              type="number"
              placeholder="MAX 3500"
              value={ratingRight}
              onChange={e => setRatingRight(e.target.value)}
            />
          </div>

          <hr className="card-divider" />

          {/* TAGS */}
          <div className="section-label">▶ SELECT TAGS</div>
          <div className="tags-grid">
            {CF_TAGS.map(tag => (
              <div
                key={tag}
                className={`tag-pill${selectedTags.has(tag) ? ' active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </div>
            ))}
          </div>

          <div className="selected-display">
            {selectedTags.size === 0
              ? 'SELECTED: NONE'
              : <>SELECTED: {[...selectedTags].map(t => <span key={t} className="sel-tag">[{t}]</span>)}</>
            }
          </div>

          <button className="submit-btn" type="button" onClick={handleStartBattle}>
            ▶ START BATTLE
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArenaFields;
