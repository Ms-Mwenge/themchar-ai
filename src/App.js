
import './styles/App.css';
import './styles/Loader.css';
import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    const location = useLocation();

  return (
    <div className="App">
      {/* Navbar */}
      
      
          {/* Hide Navbar on /login or /register */}
      {!['/login', '/register'].includes(location.pathname) && (
        <Navbar />
      )}


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>







    </div>
  );
}

export default App;
