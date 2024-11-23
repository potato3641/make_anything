import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Base from './layouts/Base';
import Examples from './components/Examples';
import SheetPage from './pages/SheetPage';
import TestPage from './pages/TestPage';
import CheckField from './components/CheckField';

function App() {
  useEffect(() => {
    document.oncontextmenu = () => {
      return false;
    }
  }, [])
  return (
    <Router>
      <Base>
        <Routes>
          <Route path="/" element={<Navigate to="/sheets" replace />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/sheets" element={<SheetPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/check" element={<CheckField />} />
        </Routes>
      </Base>
    </Router >
  );
}

export default App;
