import Home from './pages/Home'
import ArenaFields from './pages/ArenaFields'
import JoinRoom from './components/JoinRoom'
import Solving from './pages/Solving'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Creator fills settings here */}
      <Route
        path="/arena"
        element={<ArenaFields arenaName="1vs1" />}
      />

      {/* Opponent lands here to join */}
      <Route path="/room/:roomId" element={<JoinRoom />} />

      {/* Battle page — both players redirected here by socket */}
      <Route path="/room/:roomId/battle" element={<Solving />} />
    </Routes>
  )
}

export default App
