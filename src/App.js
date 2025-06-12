
import './styles/App.css';
import './styles/Loader.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  return (
    <div className="App">
      {/* Navbar */}
      
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>







    </div>
  );
}

export default App;
