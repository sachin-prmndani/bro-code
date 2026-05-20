import { useRef, useState, type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Editor, type OnMount } from '@monaco-editor/react';

interface Problem {
  name: string;
  contestId: number;
  index: string;
  rating: number;
  tags: string[];
}

interface LocationState {
  problem: Problem;
  players: { p1: string; p2: string };
  handle: string;
}

const LANGUAGES = ['cpp', 'python', 'java', 'javascript', 'typescript', 'rust'];

function Solving() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const [code, setCode] = useState('// write your solution here\n');
  const [language, setLanguage] = useState('cpp');

  if (!state) {
    return (
      <div style={{
        background: '#0a0a0a', color: '#39ff14', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Press Start 2P", monospace', fontSize: '0.8rem',
        gap: '1rem', flexWrap: 'wrap', textAlign: 'center', padding: '2rem',
      }}>
        NO ACTIVE BATTLE.
        <span
          style={{ cursor: 'pointer', color: '#ff2d78' }}
          onClick={() => navigate('/arena')}
        >GO TO ARENA →</span>
      </div>
    );
  }

  const { problem, players } = state;
  const cfProblemUrl = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;

  const ratingColor =
    problem.rating >= 2400 ? '#ff2d78' :
    problem.rating >= 1900 ? '#ff8c00' :
    problem.rating >= 1600 ? '#a0a0ff' :
    problem.rating >= 1200 ? '#39ff14' :
    '#aaaaaa';

  return (
    <div style={styles.root}>

      {/* ── TOP BAR ── */}
      <div style={styles.topBar}>
        <span style={styles.topBarLeft}>⚔ BRO CODE</span>
        <span style={styles.topBarCenter}>
          <span style={styles.p1}>{players.p1}</span>
          <span style={styles.vs}> VS </span>
          <span style={styles.p2}>{players.p2}</span>
        </span>
        <span style={styles.topBarRight}>
          RATING: <span style={{ color: ratingColor }}>{problem.rating}</span>
        </span>
      </div>

      {/* ── MAIN SPLIT ── */}
      <div style={styles.mainSplit}>

        {/* ── LEFT: PROBLEM PANEL ── */}
        <div style={styles.problemPanel}>

          {/* Problem header */}
          <div style={styles.problemHeader}>
            <span style={styles.problemId}>
              {problem.contestId}{problem.index}
            </span>
            <span style={styles.problemName}>{problem.name}</span>
            <span style={{ ...styles.ratingBadge, color: ratingColor, borderColor: ratingColor + '55' }}>
              ★ {problem.rating}
            </span>
          </div>

          {/* Tags */}
          <div style={styles.tagRow}>
            {problem.tags.map(tag => (
              <span key={tag} style={styles.tagChip}>{tag}</span>
            ))}
          </div>

          {/* Open on CF CTA — big retro card since we can't iframe */}
          <div style={styles.cfCard}>
            <div style={styles.cfCardGlitch}>CODEFORCES BLOCKS EMBEDDING</div>
            <div style={styles.cfCardSub}>open the problem in a new tab to read it</div>

            <a
              href={cfProblemUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.cfBigBtn}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 30px #39ff14, 0 0 60px #39ff1444';
                (e.currentTarget as HTMLAnchorElement).style.background = '#003300';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 16px #39ff1466';
                (e.currentTarget as HTMLAnchorElement).style.background = '#001a00';
              }}
            >
              ▶ OPEN PROBLEM ↗
            </a>

            {/* Problem info summary */}
            <div style={styles.infoGrid}>
              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>CONTEST</div>
                <div style={styles.infoValue}>{problem.contestId}</div>
              </div>
              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>INDEX</div>
                <div style={styles.infoValue}>{problem.index}</div>
              </div>
              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>RATING</div>
                <div style={{ ...styles.infoValue, color: ratingColor }}>{problem.rating}</div>
              </div>
              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>TAGS</div>
                <div style={styles.infoValue}>{problem.tags.length}</div>
              </div>
            </div>

            {/* Scanline decoration */}
            <div style={styles.scanlines} />
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={styles.divider} />

        {/* ── RIGHT: EDITOR PANEL ── */}
        <div style={styles.editorPanel}>
          <div style={styles.editorHeader}>
            <span style={{ color: '#39ff14', fontSize: '0.65rem', fontFamily: '"Press Start 2P", monospace' }}>
              ▶ CODE
            </span>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={styles.langSelect}
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <Editor
            height="calc(100vh - 84px)"
            language={language}
            value={code}
            theme="vs-dark"
            onMount={editor => {
              editorRef.current = editor;
              editor.focus();
            }}
            onChange={val => setCode(val ?? '')}
            options={{
              fontSize: 14,
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              padding: { top: 12 },
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── STYLES ──
const styles: Record<string, CSSProperties> = {
  root: {
    background: '#0a0a0a',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: '"VT323", monospace',
  },
  topBar: {
    height: '42px',
    background: '#111',
    borderBottom: '2px solid #1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    flexShrink: 0,
  },
  topBarLeft: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.6rem',
    color: '#39ff14',
    letterSpacing: '2px',
  },
  topBarCenter: {
    fontSize: '1.2rem',
    letterSpacing: '3px',
  },
  topBarRight: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.55rem',
    color: '#aaa',
  },
  p1: { color: '#39ff14' },
  vs: {
    color: '#ff2d78',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.55rem',
    margin: '0 0.6rem',
  },
  p2: { color: '#00cfff' },
  mainSplit: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },

  // Problem panel
  problemPanel: {
    width: '42%',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #1a1a1a',
    overflow: 'hidden',
    background: '#0a0a0a',
  },
  problemHeader: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#0d0d0d',
    flexShrink: 0,
  },
  problemId: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.6rem',
    color: '#ffe600',
    background: '#1a1800',
    padding: '4px 8px',
    border: '1px solid #ffe60044',
    flexShrink: 0,
  },
  problemName: {
    color: '#eee',
    fontSize: '1.1rem',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    letterSpacing: '1px',
  },
  ratingBadge: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.5rem',
    border: '1px solid',
    padding: '3px 7px',
    flexShrink: 0,
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    padding: '0.6rem 1rem',
    borderBottom: '1px solid #1a1a1a',
    background: '#0d0d0d',
    flexShrink: 0,
  },
  tagChip: {
    fontSize: '0.8rem',
    color: '#00cfff',
    background: '#001a22',
    border: '1px solid #00cfff33',
    padding: '2px 10px',
    letterSpacing: '0.5px',
  },

  // CF card
  cfCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.015) 2px, rgba(0,255,0,0.015) 4px)',
  },
  scanlines: {
    position: 'absolute',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  cfCardGlitch: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.55rem',
    color: '#ff2d78',
    letterSpacing: '1px',
    textAlign: 'center',
    zIndex: 1,
  },
  cfCardSub: {
    fontSize: '1rem',
    color: '#555',
    letterSpacing: '1px',
    textAlign: 'center',
    zIndex: 1,
  },
  cfBigBtn: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.75rem',
    color: '#39ff14',
    background: '#001a00',
    border: '2px solid #39ff14',
    boxShadow: '0 0 16px #39ff1466',
    padding: '16px 32px',
    textDecoration: 'none',
    letterSpacing: '2px',
    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
    transition: 'all 0.15s ease',
    zIndex: 1,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    width: '100%',
    maxWidth: '300px',
    zIndex: 1,
  },
  infoBox: {
    background: '#111',
    border: '1px solid #222',
    padding: '0.6rem 0.8rem',
    textAlign: 'center',
  },
  infoLabel: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.4rem',
    color: '#555',
    marginBottom: '0.4rem',
    letterSpacing: '1px',
  },
  infoValue: {
    fontSize: '1.3rem',
    color: '#eee',
    letterSpacing: '1px',
  },

  // Divider
  divider: {
    width: '3px',
    background: 'linear-gradient(to bottom, #39ff1422, #ff2d7844, #39ff1422)',
    flexShrink: 0,
  },

  // Editor panel
  editorPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  editorHeader: {
    height: '42px',
    background: '#0d0d0d',
    borderBottom: '1px solid #1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1rem',
    flexShrink: 0,
  },
  langSelect: {
    background: '#1a1a1a',
    color: '#39ff14',
    border: '1px solid #333',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.5rem',
    padding: '4px 8px',
    cursor: 'pointer',
    outline: 'none',
  },
};

export default Solving;