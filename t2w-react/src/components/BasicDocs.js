import React, { useState, useEffect } from 'react';
import './BasicDocs.css';

const BasicDocs = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [exampleText, setExampleText] = useState('NO CONTENT');
  useEffect(() => {
    // 프로덕션에서는 혹시모를 오류를 찾기 위해 useEffect가 두번 실행된다
    const fetchDataLoad = async () => {
      try {
        const response = await fetch(`${apiUrl}/t2wexampletext`);
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
  }, [apiUrl]);

  return (
    <div className="docs-container">
      <div className="input-container">
        <div id="markdown-content" className="markdown-content">{exampleText}</div>
      </div>
      <div className="preview-container">
        <iframe id="preview" title="exampleVideo" src={`${apiUrl}/t2wexample`}></iframe>
      </div >
    </div >
  );
};

export default BasicDocs;
