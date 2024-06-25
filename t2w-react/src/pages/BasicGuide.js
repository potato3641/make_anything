import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BasicGuide.css';
import BasicSlide from '../components/BasicSlide';
import BasicDocs from '../components/BasicDocs';


const BasicGuide = () => {
  const [openSlide, setOpenSlide] = useState(false);
  const [openDocs, setOpenDocs] = useState(false);
  const [openDeepDocs, setOpenDeepDocs] = useState(false);
  const docsSwitchDeep = () => {
    setOpenDeepDocs(!openDeepDocs);
  }
  return (
    <div className="guide-content">
      <div className="button-container">
        <button
          type="button"
          className={`btn ${openSlide ? 'btn-secondary' : 'btn-danger'} rounded-pill px-3`}
          onClick={() => { setOpenSlide(!openSlide) }}
          disabled={openDocs ? true : false}
        >{openSlide ? '■' : '▶'}</button>
        <button
          type="button"
          className={`btn ${openDocs ? 'btn-secondary' : 'btn-primary'} hvr-bounce-to-right`}
          onClick={() => { setOpenDocs(!openDocs); setOpenDeepDocs(false); }}
          disabled={openSlide ? true : false}
        >{openDocs ? '가이드 문서 닫기' : '가이드 문서 열기'}</button>
      </div>
      <div className="open-container">
        {(openSlide && !openDocs) && <BasicSlide />}
        {(!openSlide && openDocs) && <BasicDocs flag={openDeepDocs} onUpdate={docsSwitchDeep} />}
      </div>
    </div >
  );
};
export default BasicGuide;
