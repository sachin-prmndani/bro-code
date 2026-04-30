import React from 'react'
import Banner from '../assets/Banner.png'
import ArenaButton from '../components/ArenaButton'



function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000' }}>
      <div className='banner' style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000, width: '100%' }}>
        <img src={Banner} alt="" style={{ width: '100%', height: '180px', display: 'block' }} />
      </div>
      <div style={{display:'grid',placeItems:'center'}}>
        <ArenaButton/>
      </div>
    </div>

  )
}

export default Home