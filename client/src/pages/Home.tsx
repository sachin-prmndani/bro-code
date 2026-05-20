// pages/Home.tsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import socket from '../socket'

import Banner from '../assets/Banner.png'
import ArenaButton from '../components/ArenaButton'

function Home() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [handle, setHandle] = useState('')
  const [phase, setPhase] = useState<'input' | 'waiting' | 'error'>('input')
  const [errorMsg, setErrorMsg] = useState('')

  const openModal = () => {
    setShowModal(true)
    setPhase('input')
    setRoomId('')
    setHandle('')
    setErrorMsg('')
  }

  const closeModal = () => {
    setShowModal(false)
    setPhase('input')
  }

  const handleJoin = () => {
    if (!handle.trim() || !roomId.trim()) return

    // Listen for battle start
    socket.on('battle_start', ({ problem, roomId: rId, players }) => {
      socket.off('battle_start')
      socket.off('error')
      navigate(`/room/${rId}/battle`, {
        state: { problem, players, handle: handle.trim() },
      })
    })

    socket.on('error', ({ message }: { message: string }) => {
      socket.off('battle_start')
      socket.off('error')
      setErrorMsg(message)
      setPhase('error')
    })

    socket.emit('join_room', { roomId: roomId.trim(), handle: handle.trim() })
    setPhase('waiting')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000' }}>

      {/* Banner */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          width: '100%',
        }}
      >
        <img
          src={Banner}
          alt="Banner"
          style={{ width: '100%', height: '180px', display: 'block' }}
        />
      </div>

      {/* Buttons */}
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          gap: '20px',
          paddingTop: '250px',
        }}
      >
        <Link to="/arena">
          <ArenaButton buttonName="⚔ 1 VS 1 ARENA" />
        </Link>

        <Link to="/room/editor">
          <ArenaButton buttonName="OPEN EDITOR" />
        </Link>

        {/* Join Room — same ArenaButton style, opens modal */}
        <div onClick={openModal}>
          <ArenaButton buttonName="⚔ JOIN ROOM" />
        </div>
      </div>

      {/* ── JOIN ROOM MODAL ── */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Stop click propagation so clicking inside doesn't close */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0d0d0d',
              border: '2px solid #FF4500',
              boxShadow: '0 0 30px #FF4500, 0 0 60px #8B0000',
              padding: '2.5rem 2rem',
              minWidth: '340px',
              maxWidth: '420px',
              width: '90%',
              fontFamily: '"Press Start 2P", cursive',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '12px',
                right: '14px',
                background: 'none',
                border: 'none',
                color: '#FF4500',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '0.7rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            {/* ── INPUT PHASE ── */}
            {phase === 'input' && (
              <>
                <h2 style={{
                  color: '#FFD700',
                  fontSize: '0.85rem',
                  marginBottom: '2rem',
                  textAlign: 'center',
                  letterSpacing: '2px',
                }}>
                  ⚔ JOIN ROOM ⚔
                </h2>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={labelStyle}>▶ ROOM ID</div>
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="e.g. 3a7b2"
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleJoin()}
                    autoFocus
                  />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={labelStyle}>▶ YOUR CF HANDLE</div>
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="enter handle"
                    value={handle}
                    onChange={e => setHandle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleJoin()}
                  />
                </div>

                <button
                  onClick={handleJoin}
                  disabled={!roomId.trim() || !handle.trim()}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '0.75rem',
                    fontFamily: '"Press Start 2P", cursive',
                    color: '#FFD700',
                    background: !roomId.trim() || !handle.trim()
                      ? 'linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%)'
                      : 'linear-gradient(180deg, #8B0000 0%, #3B0000 100%)',
                    border: '2px solid #FF4500',
                    boxShadow: !roomId.trim() || !handle.trim()
                      ? 'none'
                      : '0 0 16px #FF4500, inset 0 1px 0 #FF6347',
                    cursor: !roomId.trim() || !handle.trim() ? 'not-allowed' : 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  ▶ JOIN BATTLE
                </button>
              </>
            )}

            {/* ── WAITING PHASE ── */}
            {phase === 'waiting' && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  color: '#FFD700',
                  fontSize: '0.75rem',
                  marginBottom: '1.5rem',
                  letterSpacing: '2px',
                }}>
                  ⚔ JOINED ROOM ⚔
                </h2>
                <div style={{
                  color: '#FF4500',
                  fontSize: '1.1rem',
                  fontFamily: '"VT323", monospace',
                  letterSpacing: '2px',
                  marginBottom: '1rem',
                }}>
                  ROOM: <span style={{ color: '#FFD700' }}>{roomId}</span>
                </div>
                <div style={{
                  color: '#39ff14',
                  fontSize: '0.6rem',
                  animation: 'pulse 1.2s infinite',
                  marginTop: '1rem',
                }}>
                  ● FETCHING BATTLE PROBLEM...
                </div>
                <div style={{
                  color: '#aaa',
                  fontSize: '0.55rem',
                  marginTop: '1rem',
                  fontFamily: '"VT323", monospace',
                  letterSpacing: '1px',
                }}>
                  GET READY<span style={{ animation: 'blink 1s infinite' }}>_</span>
                </div>
                <style>{`
                  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
                  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
                `}</style>
              </div>
            )}

            {/* ── ERROR PHASE ── */}
            {phase === 'error' && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  color: '#ff4444',
                  fontSize: '0.75rem',
                  marginBottom: '1.5rem',
                  letterSpacing: '2px',
                }}>
                  ⚠ ERROR
                </h2>
                <div style={{
                  color: '#ff4444',
                  fontSize: '0.6rem',
                  marginBottom: '2rem',
                  lineHeight: '1.6',
                }}>
                  ▶ {errorMsg}
                </div>
                <button
                  onClick={() => setPhase('input')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.65rem',
                    fontFamily: '"Press Start 2P", cursive',
                    color: '#FFD700',
                    background: 'linear-gradient(180deg, #8B0000 0%, #3B0000 100%)',
                    border: '2px solid #FF4500',
                    boxShadow: '0 0 16px #FF4500',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                  }}
                >
                  ▶ TRY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  color: '#FF4500',
  fontSize: '0.55rem',
  marginBottom: '0.5rem',
  letterSpacing: '1px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: '#0a0a0a',
  border: '1px solid #FF4500',
  color: '#FFD700',
  fontFamily: '"VT323", monospace',
  fontSize: '1.1rem',
  letterSpacing: '1px',
  outline: 'none',
  boxSizing: 'border-box',
  boxShadow: 'inset 0 0 8px #FF450033',
}

export default Home