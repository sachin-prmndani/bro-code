// pages/Home.tsx

import React from 'react'
import { Link } from 'react-router-dom'

import Banner from '../assets/Banner.png'
import ArenaButton from '../components/ArenaButton'
import JoinRoom from '../components/JoinRoom'

function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000' }}>
      
      <div
        className="banner"
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
          style={{
            width: '100%',
            height: '180px',
            display: 'block',
          }}
        />
      </div>

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

        <JoinRoom />
      </div>
    </div>
  )
}

export default Home