import { Route, Routes } from 'react-router-dom';
import './App.css';
import GetConfig from './pages/GetConfig';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="get-config" element={<GetConfig />} />
      </Routes>
    </div>
  );
}

export default App;
