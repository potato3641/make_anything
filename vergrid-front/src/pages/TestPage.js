import { React, useEffect } from 'react';
import './TestPage.css';

const TestPage = ({ children }) => {
  useEffect(() => {
    // test구간
    // test구간
  }, [])
  return (
    <main>
      {children}
    </main>
  );
};

export default TestPage;