import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Base from './layouts/Base';
import Examples from './components/Examples';
import SheetPage from './pages/SheetPage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Router>
      <Base>
        <Routes>
          <Route path="/" element={<Navigate to="/examples" replace />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/sheets" element={<SheetPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </Base>
    </Router>
  );
}

export default App;
