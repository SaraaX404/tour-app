import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Components/dashboard'
import Hotels from './Components/hotels'
import Tours from './Components/tours'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/tours" element={<Tours />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
