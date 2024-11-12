import { React } from 'react';
import './Base.css';

const Base = ({ children }) => {
  return (
    <main>
      {children}
    </main>
  );
};

export default Base;