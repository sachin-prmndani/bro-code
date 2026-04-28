import React from 'react'
import Banner from './assets/Banner.png'
import Modes from "./components/Modes";

function App() {
  return (
    <>
  
    <div className='banner' style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000, width: '100%',color:'#000000' }}>
      <img src={Banner} alt="" style={{ width: '100%', height: '180px', display: 'block' }} />
      
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingTop: '180px', boxSizing: 'border-box' }}>
  <Modes />
</div>


    

     
    </>
  )
}

export default App