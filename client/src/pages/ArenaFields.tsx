import React, { useState } from 'react';
import '../css/arenaField.css';

function createRoomId(){
    const characters  = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];    
    const nums = ['0','1','2','3','4','5','6','7','8','9'];
    let roomId = '';
    for(let i = 0 ; i<5;i++){
        if(i&1){
            roomId+=characters[Math.floor(Math.random()*characters.length)];
        }else{
            roomId+=nums[Math.floor(Math.random()*nums.length)];
        }
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

function ArenaFields({ arenaName }: ArenaFieldsProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  return (
    <>
      {/* ── Google Fonts ── */}
      {/* <style>{arenaField}</style> */}
      

      <div className="arena-page">
        {/* Fixed Banner */}
        

        {/* Content */}
        <div className="arena-content">
          <h1 className="arena-title">⚔ {arenaName} RoomID:{roomID} ⚔</h1>

          <p className="arena-subtitle">SELECT BATTLE SPECS<span className="blink">_</span></p>

          <div className="arena-card">
            {/* ── PLAYERS ── */}
            <div className="section-label">▶ PLAYERS</div>
            <div className="players-row">
              <div>
                <div className="player-badge p1-badge">◆ Your Handle</div>
                <input className="pixel-input" type="text" placeholder="enter handle" />
              </div>
              {/* <div>
                <div className="player-badge p2-badge">◆ PLAYER 2</div>
                <input className="pixel-input p2-input" type="text" placeholder="enter handle" />
              </div> */}
            </div>
            {/* <div className="vs-divider">— VS —</div> */}

            <hr className="card-divider" />

            {/* ── RATING ── */}
            <div className="section-label">▶ PROBLEM RATING</div>
            <div className="rating-row">
              <input className="pixel-input" type="number" placeholder="MIN  800" name="leftRange" />
              <div className="rating-sep">TO</div>
              <input className="pixel-input" type="number" placeholder="MAX 3500" name="rightRange" />
            </div>

            <hr className="card-divider" />

            {/* ── TAGS ── */}
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

            {/* ── SUBMIT ── */}
            <button className="submit-btn" type="button">
              ▶ START BATTLE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArenaFields;