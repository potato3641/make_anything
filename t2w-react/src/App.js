import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Base from './layouts/Base';
import TextPage from './pages/TextPage';
import FilePage from './pages/FilePage';
import BasicGuide from './pages/BasicGuide';
import './App.css';

function App() {
  return (
    <Router>
      <Base>
        <Routes>
          <Route path="/" element={<Navigate to="/t2wtext" replace />} />
          <Route path="/t2wtext" element={<TextPage />} />
          <Route path="/t2wfile" element={<FilePage />} />
          <Route path="/t2wguidebasic" element={<BasicGuide />} />
          {/*<Route path="/t2wguide/markdown" element={<GuideMarkdown />} />*/}
        </Routes>
      </Base>
    </Router>
  );
}

export default App;
