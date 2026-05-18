import React from 'react'
import Home from './pages/Home'
import ArenaFields from './pages/ArenaFields'
import Solving from './pages/Solving'

import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/arena"
        element={
          <div>
            <ArenaFields arenaName="1vs1" />
          </div>
        }
      />

      <Route
        path="/room/editor"
        element={<Solving />}
      />
    </Routes>
  )
}

export default App