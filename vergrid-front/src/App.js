import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Base from './layouts/Base';
import SheetPage from './pages/SheetPage';

function App() {
  useEffect(() => {
    document.oncontextmenu = () => {
      return false;
    }
  }, [])
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Base>
        <Routes>
          <Route path="/" element={<Navigate to="/sheets" replace />} />
          <Route path="/sheets" element={<SheetPage />} />
        </Routes>
      </Base>
    </Router >
  );
}

export default App;
