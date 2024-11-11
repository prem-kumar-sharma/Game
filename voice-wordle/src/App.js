import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Game from './components/Game/Game';
import StoryMode from './components/StoryMode/StoryMode';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Game />} />
        <Route path="/story" element={<StoryMode />} />
      </Routes>
    </Router>
  );
}

export default App;