import { React } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Base.css';

const Base = ({ children }) => {
  return (
    <div className="centered-container">
      <header className="nav-bar">
        <Link to="/t2wtext" className="nav-link">슬라이드 만들기</Link>
        <Link to="/t2wguidebasic" className="nav-link">가이드 기본편</Link>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Base;
