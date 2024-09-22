import React, { useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './Sheets.css';

const Sheets = ({ size }) => {
  const sizeOfSheet = size;
  const gridIndex = [];
  const maximumsize = 1000;
  for (let i = 0; i < sizeOfSheet; i++) {
    for (let j = 0; j < sizeOfSheet; j++) {
      gridIndex.push({ i, j });
    }
  }

  const [refMode, setRefMode] = useState(false);
  const [cellValues, setCellValues] = useState({});
  const [focusTarget, setFocusTarget] = useState(null); // TextField Fouce Target
  const [touchTarget, setTouchTarget] = useState(null); // TextField Touch Target
  const focusTargetRef = useRef({});

  // 셀 더블클릭 이벤트
  const handlerDoubleClickCell = (i, j) => {
    if (!refMode) {
      setTouchTarget(null);
      setFocusTarget(`$${i}$${j}`);
    }
  };

  // 셀 클릭 이벤트
  const handlerClickCell = (i, j) => {
    if (refMode)
      referenceMode(i, j);
    else
      setTouchTarget(`$${i}$${j}`);
  }

  // 셀 업데이트
  const updateCellValue = (key, value) => {
    setCellValues({
      ...cellValues,
      [key]: value,
    });
  };

  // 셀 언포커싱
  const handlerUnfoucedTarget = (i, j, event) => {
    if (refMode) return;
    setFocusTarget(null);
    const key = `$${i}$${j}`;
    updateCellValue(key, event.target.value);
    // console.log(`recently added - key : [${key}], values : [${event.target.value}]`)
  };

  // 키 입력 반응
  const handlerKeyDown = (event, layer = true) => {
    if (layer && event.key === 'Enter') {
      setFocusTarget(null);
      setRefMode(false);
    }
    if (!layer && !(touchTarget === null)) {
      const regex = /\$([0-9]+)\$([0-9]+)/;
      const match = touchTarget.match(regex);
      if (event.key === 'ArrowUp')
        setTouchTarget(`$${parseFloat(match[1]) ? parseFloat(match[1]) - 1 : 0}$${parseFloat(match[2])}`);
      if (event.key === 'ArrowDown')
        setTouchTarget(`$${parseFloat(match[1]) < sizeOfSheet - 1 ? parseFloat(match[1]) + 1 : sizeOfSheet - 1}$${parseFloat(match[2])}`);
      if (event.key === 'ArrowLeft')
        setTouchTarget(`$${parseFloat(match[1])}$${parseFloat(match[2]) ? parseFloat(match[2]) - 1 : 0}`);
      if (event.key === 'ArrowRight')
        setTouchTarget(`$${parseFloat(match[1])}$${parseFloat(match[2]) < sizeOfSheet - 1 ? parseFloat(match[2]) + 1 : sizeOfSheet - 1}`);
      if (event.key === 'Enter') {
        event.preventDefault();
        const key = `$${match[1]}$${match[2]}`;
        setTouchTarget(null);
        setFocusTarget(key);
        setRefMode(true);
      }
      if (event.key === 'Delete') {
        const key = `$${match[1]}$${match[2]}`;
        updateCellValue(key, '');
      }
    }
  };

  // 셀 입력 반응
  const handlerTextChange = (i, j, event) => {
    const value = event.target.value;
    if (!refMode && value.startsWith("="))
      setRefMode(true);
    else if (refMode && !value.startsWith("="))
      setRefMode(false);
    const key = `$${i}$${j}`;
    updateCellValue(key, value)
  };

  // 셀 수식모드
  const referenceMode = (i, j) => {
    if (!refMode) return;
    /* 진입 조건 정리
    1. handlerTextChange에서 첫글자 =를 감지
    2. refMode를 True로
    3. >>>button의 클릭기능 handlerDoubleClickCell을 대체함<<<
      - 클릭된 셀의 i, j를 받아옴
    4. onBlur를 막아야함
    */
    const key = `$${i}$${j}`;
    updateCellValue(focusTarget, cellValues[focusTarget] + key);
    focusTargetRef.current[focusTarget].focus();
  };

  // 셀 계산
  const calFormula = (formula, funcall = 0) => {
    if (!formula?.startsWith("="))
      return formula;
    if (funcall > maximumsize)
      throw new Error(`순환 참조 오류 발생 ${funcall}번째 호출`);
    const target = formula.slice(1);
    const regex = /\$([0-9]+)\$([0-9]+)/g; // $n$n을 모두(g) 검색
    const keys = [...target.matchAll(regex)]; // 검색결과 정리
    let replacedTarget = target;
    let numericFlag = true; // 문자판별기
    const isNumeric = (value) => !isNaN(value) && !isNaN(parseFloat(value)); // 문자판별함수

    keys.forEach((match) => {
      const key = `$${match[1]}$${match[2]}`;
      const value = calFormula(cellValues[key], funcall + 1) || 0;
      numericFlag &= isNumeric(value); // 문자판별중
      replacedTarget = replacedTarget.replace(key, value);
    });

    if (!numericFlag) { // 문자 감지됨 escape
      let combineTarget = target.replaceAll('+', '');
      keys.forEach((match) => {
        const key = `$${match[1]}$${match[2]}`;
        const value = calFormula(cellValues[key], funcall + 1) || '';
        combineTarget = combineTarget.replace(key, value);
      });
      return combineTarget;
    }

    const parts = replacedTarget.split(/([+\-*/])/); // 사칙연산분리
    let result = parts[0];

    for (let i = 1; i < parts.length; i += 2) {
      const target = parts[i];
      const nextValue = parts[i + 1];
      result = parseFloat(result);
      const nextNumber = parseFloat(nextValue);

      switch (target) {
        case '+':
          result += nextNumber;
          break;
        case '-':
          result -= nextNumber;
          break;
        case '*':
          result *= nextNumber;
          break;
        case '/':
          result /= nextNumber;
          break;
        default:
          break;
      }
    }
    return result;

  }

  return (
    <div className='sheet-body' onKeyDown={(event) => handlerKeyDown(event, false)}>
      <Grid className='grid-container' container spacing={0}>
        {gridIndex.map(({ i, j }) => (
          <Grid className={'grid-item' + (touchTarget === `$${i}$${j}` ? ' cell-focused' : '')} item xs={12 / sizeOfSheet} key={`$${i}$${j}`}>
            {focusTarget === `$${i}$${j}` ? (
              <TextField
                inputRef={(e) => (focusTargetRef.current[`$${i}$${j}`] = e)}
                value={cellValues[`$${i}$${j}`] || ''}
                className='cell-body'
                onBlur={(event) => handlerUnfoucedTarget(i, j, event)}
                onChange={(event) => handlerTextChange(i, j, event)}
                onKeyDown={(event) => handlerKeyDown(event)}
                variant="outlined" multiline fullWidth autoFocus />
            ) : (
              <Button
                className='cell-cover'
                onDoubleClick={() => handlerDoubleClickCell(i, j)}
                onClick={() => handlerClickCell(i, j)}
                variant="text">
                {calFormula(cellValues[`$${i}$${j}`]) || ''}
              </Button>
            )}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Sheets;