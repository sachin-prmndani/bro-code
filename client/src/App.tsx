import React from 'react'
import Home from './pages/Home'
import ArenaFields from './pages/ArenaFields'
import ArenaButton from './components/ArenaButton'
import CodeEditor from './components/CodeEditor'
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
    </Routes>
  )
}

export default App