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

  const [refMode, setRefMode] = useState(false); // Flag of Reference Mode
  const [cellValues, setCellValues] = useState({}); // Sheet Live Value
  const [focusTarget, setFocusTarget] = useState(null); // TextField Fouce Target Key
  const [touchTarget, setTouchTarget] = useState(null); // TextField Touch Target Key
  const [focusTargetValue, setFocusTargetValue] = useState(undefined); // TextField Live Value
  const focusTargetRef = useRef({}); // Sheet Live Object
  const inputRef = useRef(''); // TextField Live Object

  // 셀 더블클릭 이벤트 핸들러
  const handlerDoubleClickCell = (i, j) => {
    if (!refMode) {
      const key = `$${i}$${j}`;
      openTextEditor(key)
    }
  };

  // 셀 클릭 이벤트 핸들러
  const handlerClickCell = (i, j) => {
    if (refMode)
      referenceMode(i, j);
    else
      setTouchTarget(`$${i}$${j}`);
  }

  // 셀 데이터(Value) 업데이트
  const updateCellData = (key, value) => {
    setCellValues({
      ...cellValues,
      [key]: value,
    });
  };

  // 셀 편집모드 열기 (FocusTarget의 TextField 초기화)
  const openTextEditor = (key) => {
    setTouchTarget(null);
    setFocusTarget(key);
    setFocusTargetValue(cellValues[key] || '')
  }

  // 셀 편집모드 닫기 (FocusTarget의 TextField 데이터 저장)
  const exitTextEditor = (key = focusTarget, value = inputRef.current) => {
    setFocusTarget(null);
    updateCellData(key, value)
    setRefMode(false);
  }

  // 포커싱된 셀의 커서 동작 제어
  const moveFocusTargetCursor = (i, j, event) => {
    // 준비중
  }
  // 셀 언포커싱 이벤트 핸들러
  const handlerUnfoucedTarget = (i, j, event) => {
    if (refMode) return;
    exitTextEditor(focusTarget)
  };

  // 셀 키 입력 이벤트 핸들러
  const handlerKeyDown = (event, layer = true) => {
    // 단일 타겟(ex - TextField)의 이벤트 핸들러
    if (layer && event.key === 'Enter') {
      exitTextEditor(focusTarget);
    }
    // 대상 없는 시트 전체 이벤트 핸들러(시트 컴포넌트 한정)
    // 시트 이벤트 핸들러는 touchTarget이 무조건 존재함
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
      if (event.key === 'Enter' || event.key === '=') { // 터치모드에서 엔터
        if (event.key === 'Enter')
          event.preventDefault();
        const key = `$${match[1]}$${match[2]}`;
        openTextEditor(key);
        if (event.key === '=')
          setRefMode(true);
      }
      if (event.key === 'Delete') {
        const key = `$${match[1]}$${match[2]}`;
        updateCellData(key, '');
      }
    }
  };

  // 셀 텍스트 입력 제어 (플래그 제어용)
  const handlerTextChange = (i, j, event) => {
    const value = event.target.value;
    if (!refMode && value.startsWith("="))
      setRefMode(true);
    else if (refMode && !value.startsWith("="))
      setRefMode(false);
    // 업뎃을 여기서 하면 안된다(렌더링 지연의 원인)
    inputRef.current = event.target.value;
  };

  // 셀 주소 획득 모드
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
    inputRef.current += key
    setFocusTargetValue(inputRef.current)
    focusTargetRef.current[focusTarget].value += key;
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
                onBlur={(event) => handlerUnfoucedTarget(i, j, event)}
                onChange={(event) => handlerTextChange(i, j, event)}
                onKeyDown={(event) => handlerKeyDown(event)}
                onFocus={(event) => moveFocusTargetCursor(i, j, event)}
                inputRef={(e) => (focusTargetRef.current[`$${i}$${j}`] = e)}
                defaultValue={focusTargetValue}
                className='cell-body'
                variant="outlined" multiline fullWidth autoFocus />
            ) : (
              <Button
                onDoubleClick={() => handlerDoubleClickCell(i, j)}
                onClick={() => handlerClickCell(i, j)}
                className='cell-cover'
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