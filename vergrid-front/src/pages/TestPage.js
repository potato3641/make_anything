import { React, useEffect } from 'react';
import './TestPage.css';

const TestPage = ({ children }) => {
  useEffect(() => {
    const target = "IF($1$2,1,0)";
    const regex = /IF\(([^,]+),([^,]+),([^)]+)\)/;
    const isd = target.match(regex);

    console.log(isd);
  }, [])
  return (
    <main>
      {children}
    </main>
  );
};

export default TestPage;