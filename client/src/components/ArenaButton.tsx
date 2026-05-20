interface ArenaButtonProps {
  buttonName: string;
}
function ArenaButton({buttonName}: ArenaButtonProps) {
  return (
    <div>
        <button
        style={{
          marginTop: '180px',
          padding: '18px 48px',
          fontSize: '1.4rem',
          fontFamily: '"Press Start 2P", cursive',
          color: '#FFD700',
          background: 'linear-gradient(180deg, #8B0000 0%, #3B0000 100%)',
          border: '3px solid #FF4500',
          boxShadow: '0 0 20px #FF4500, 0 0 40px #8B0000, inset 0 1px 0 #FF6347',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          transition: 'all 0.15s ease',
          clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
        }}
        onMouseEnter={e => {
          (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px #FF4500, 0 0 60px #FF4500, inset 0 1px 0 #FF6347'
          ;(e.target as HTMLButtonElement).style.background = 'linear-gradient(180deg, #CC0000 0%, #6B0000 100%)'
        }}
        onMouseLeave={e => {
          (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px #FF4500, 0 0 40px #8B0000, inset 0 1px 0 #FF6347'
          ;(e.target as HTMLButtonElement).style.background = 'linear-gradient(180deg, #8B0000 0%, #3B0000 100%)'
        }}
         //TODO:pass the arenaFields over here
      >
        {buttonName}
      </button>

    </div>
  )
}

export default ArenaButton
