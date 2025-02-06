import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ScanProduct from './pages/ScanProduct';
import CheckItem from './pages/CheckItem';
import MintItem from './pages/MintItem';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<ScanProduct />} />
        <Route path="/check" element={<CheckItem />} />
        <Route path="/mint" element={<MintItem />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;