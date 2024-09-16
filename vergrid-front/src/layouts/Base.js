import { React } from 'react';
// import { Link } from 'react-router-dom';
import './Base.css';

const Base = ({ children }) => {
  return (
    <main>
      {children}
    </main>
  );
};

export default Base;