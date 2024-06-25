import React, { useState, useEffect } from 'react';
import './BasicDocs.css';

const BasicDocs = ({ flag, onUpdate }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const basicUrl = '/t2wexample'
  const deepUrl = '/t2wexampledeep'
  const [exampleText, setExampleText] = useState('NO CONTENT');
  const [levelUrl, setLevelUrl] = useState(basicUrl);
  useEffect(() => {
    if (flag) {
      setLevelUrl(deepUrl);
    } else {
      setLevelUrl(basicUrl);
    }
    // 프로덕션에서는 혹시모를 오류를 찾기 위해 useEffect가 두번 실행된다
    const fetchDataLoad = async () => {
      try {
        const response = await fetch(`${apiUrl}${levelUrl}text`);
        if (!response.ok) {
          throw new Error('Oops, white board caused an error!');
        }
        const text = await response.text();
        setExampleText(text);
      } catch (e) {
        console.log('fetch failed')
      }
    }
    fetchDataLoad();
    return () => {

    };
  }, [flag, apiUrl, levelUrl]);

  return (
    <div className="docs-container">
      <div className="input-container">
        <div id="markdown-content" className="markdown-content">{exampleText}</div>
      </div>
      <div className="preview-container">
        <iframe id="preview" title="exampleVideo" src={`${apiUrl}${levelUrl}`}></iframe>
      </div>
      <aside className="aside aside-bottom">
        <button
          className='aside-btn'
          onClick={() => { onUpdate(); }}
        >
          {flag ? '기본편' : '심화편'}
        </button>
      </aside>
    </div >
  );
};

export default BasicDocs;
