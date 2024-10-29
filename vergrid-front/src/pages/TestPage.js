import { React, useEffect } from 'react';
import './TestPage.css';

const TestPage = ({ children }) => {
  useEffect(() => {
    // test구간
    const regex = /(?:[\w\u3131-\uD79D]+\([^\)]*\)|\([^\)]*\)|\$\d+\$\d+|[\w\u3131-\uD79D]+)\s*(?:==|<|<=|>|>=|!==)\s*(?:[\w\u3131-\uD79D]+\([^\)]*\)|\([^\)]*\)|\$\d+\$\d+|[\w\u3131-\uD79D]+)/g;
    const target = '안녕==안녕'
    const inside = target.match(regex);
    console.log(target);
    console.log(inside);
    // test구간
  }, [])
  return (
    <main>
      {children}
    </main>
  );
};

export default TestPage;