import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Model3D from './pages/Model3D';
import AdminPanel from './pages/AdminPanel';
import ScanNFC from './pages/ScanNFC';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<ScanNFC />} />
        <Route path="/model" element={<Model3D />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;