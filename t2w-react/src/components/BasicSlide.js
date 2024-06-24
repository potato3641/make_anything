import React from 'react';
import './BasicSlide.css';

const BasicSlide = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  return (
    <div className="slide-container">
      <iframe id="slide" title="basicVideo" src={`${apiUrl}/t2wguidebasic`}></iframe>
    </div >
  );
};

export default BasicSlide;
