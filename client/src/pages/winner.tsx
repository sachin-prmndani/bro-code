import { useNavigate, useSearchParams } from 'react-router-dom'

function WinnerPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const winnerHandle = searchParams.get('winner') || 'Unknown'

  const handleReturnHome = () => {
    navigate('/')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0f',
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(0,255,0,0.03) 0px, rgba(0,255,0,0.03) 1px, transparent 1px, transparent 2px)',
        fontFamily: "'VT323', monospace",
        color: '#00ff9f',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '2.5rem',
          color: '#ffe600',
          textShadow: '0 0 10px #ffe600, 0 0 20px #ffe600, 0 0 40px #ff9900',
          marginBottom: '2rem',
          letterSpacing: '4px',
        }}
      >
        WINNER!
      </h1>

      <div
        style={{
          border: '3px solid #00ff9f',
          boxShadow: '0 0 15px #00ff9f, inset 0 0 15px #00ff9f',
          borderRadius: '8px',
          padding: '2rem 3rem',
          marginBottom: '3rem',
          backgroundColor: 'rgba(0, 255, 159, 0.05)',
        }}
      >
        <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Player
        </p>
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '1.8rem',
            color: '#ff00ff',
            textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff',
            wordBreak: 'break-word',
          }}
        >
          {winnerHandle}
        </p>
        <p style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
          takes the victory!
        </p>
      </div>

      <button
        onClick={handleReturnHome}
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '1rem',
          padding: '1rem 2rem',
          backgroundColor: '#0a0a0f',
          color: '#00ff9f',
          border: '3px solid #00ff9f',
          borderRadius: '6px',
          cursor: 'pointer',
          boxShadow: '0 0 10px #00ff9f',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#00ff9f'
          e.currentTarget.style.color = '#0a0a0f'
          e.currentTarget.style.boxShadow = '0 0 20px #00ff9f, 0 0 40px #00ff9f'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#0a0a0f'
          e.currentTarget.style.color = '#00ff9f'
          e.currentTarget.style.boxShadow = '0 0 10px #00ff9f'
        }}
      >
        Return to Main Menu
      </button>
    </div>
  )
}

export default WinnerPage
