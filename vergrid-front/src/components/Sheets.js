import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import './Sheets.css';

const DEBUG_FLAG = true;
const __DEBUG = (msg) => DEBUG_FLAG ? console.log(msg) : msg;

const Sheets = forwardRef(({ size, toolbarHeight, loader, inheritData }, ref) => {
  const sizeOfSheet = size;
  const gridIndex = [];
  const maximumsize = 1000;
  for (let i = 0; i < sizeOfSheet; i++) {
    for (let j = 0; j < sizeOfSheet; j++) {
      gridIndex.push({ i, j });
    }
  }

  const [loading, setLoading] = useState(true);
  const [refMode, setRefMode] = useState(false); // Flag of Reference Mode
  const [cellValues, setCellValues] = useState(inheritData || {}); // Sheet Live Value
  const [focusTarget, setFocusTarget] = useState(null); // TextField Fouce Target Key
  const [touchTarget, setTouchTarget] = useState(null); // TextField Touch Target Key
  const [focusTargetValue, setFocusTargetValue] = useState(undefined); // TextField Live Value
  const focusTargetRef = useRef({}); // Sheet Live Object
  const inputRef = useRef(''); // TextField Live Object

  useImperativeHandle(ref, () => ({
    getCellValues() {
      return cellValues;
    },
    delPrevValues() {
      setCellValues({});
    }
  }));

  useEffect(() => {
    setLoading(true);
    setCellValues(() => inheritData || {});
  }, [inheritData]);

  useEffect(() => {
    if (cellValues) {
      loader();
      setLoading(false);
    }
  }, [cellValues, loader]);

  /**
   * 셀 더블클릭 이벤트 핸들러
   */
  const handlerDoubleClickCell = (i, j) => {
    if (!refMode) {
      const key = `$${i}$${j}`;
      openTextEditor(key)
    }
  };

  /**
   * 셀 클릭 이벤트 핸들러
   */
  const handlerClickCell = (i, j) => {
    const key = `$${i}$${j}`
    if (touchTarget === key) { // touch한 셀 클릭 시 편집모드
      openTextEditor(key);
      return;
    }
    if (refMode) {
      // __DEBUG(isReferenceOkay(focusTargetRef.current[focusTarget]?.value))
      if (isReferenceOkay(focusTargetRef.current[focusTarget]?.value)) {
        referenceMode(i, j);
        return;
      }
    }
    exitTextEditor();
    setTouchTarget(key);
  }

  /**
   * 셀 데이터(Value) 업데이트
   */
  const updateCellData = (key, value) => {
    setCellValues({
      ...cellValues,
      [key]: value,
    });
  };

  /**
   * 셀 편집모드 열기 (FocusTarget의 TextField 초기화)
   */
  const openTextEditor = (key) => {
    setTouchTarget(null);
    setFocusTarget(key);
    setFocusTargetValue(cellValues[key] || '')
    const value = (cellValues[key] || '') + ''
    inputRef.current = value + ''
    // 여기서 하는게 맞다 =랑 ref 판별돌려서
    // active HTMlTextField를 클릭떄 확인시켜야함
    // 레퍼런스모드에서 처리해야하나?
    // 클릭모드에서 해야한다 왜냐하면 클릭할때만 발생하는 문제이기때문
    // __DEBUG(`focus target : ${key}`)
    // __DEBUG(`html value ${focusTargetRef.current[key]?.value}`)
    // __DEBUG(`cell values in open editor : ${cellValues[key]}`)
    // __DEBUG(`reference checker : ${isReferenceOkay(cellValues[key])}`)
    setRefMode(isReferenceOkay(cellValues[key]));
  }


  // 여기에 글꼴변경모드 넣는게 맞다
  // 종료시점은? exitTextEditor실행시에 하게하면됨
  // 폐기됨. 사유 : html에 넣으면 적용이 아니라 span이 그대로 나옴 ㅋㅋ;
  /**
   * 레퍼런스모드 on/off 체크
   */
  const isReferenceOkay = (val) => { // 사칙연산도 추가해야함ㅠ
    if (val === undefined)
      return false;
    if (val === "=")
      return true;
    const lastRef = findLastMatchIndex(val);
    const strAfterRef = val.substring(lastRef?.index);
    // __DEBUG(`checker inside val : ${val}`)
    // __DEBUG(`checker inside lastRef val : ${lastRef?.value}`)
    // __DEBUG(`checker inside lastRef idx : ${lastRef?.index}`)
    // __DEBUG(`checker inside lastRef ttl : ${lastRef?.total}`)
    // __DEBUG(`checker inside valAfterRef : ${strAfterRef}`)
    // __DEBUG(`checker option 1 : ${val?.startsWith("=")}`)
    const result = (val && // 정상값인지
      val.startsWith("=") && ( // 수식모드인지
        val.charAt(val.length - 1) === '(' || // 수식 괄호 전개중인지
        val.charAt(val.length - 1) === '+' || // 수식 도중인지
        val.charAt(val.length - 1) === '-' || // 수식 도중인지
        val.charAt(val.length - 1) === '*' || // 수식 도중인지
        val.charAt(val.length - 1) === '/' || // 수식 도중인지
        strAfterRef === lastRef?.value // 수식모드지만 아직 Ref가 없는지
      ));
    return result
  }

  /** 
   * 셀 편집모드 닫기 (FocusTarget의 TextField 데이터 저장)
   */
  const exitTextEditor = (key = focusTarget, value = inputRef.current) => {
    setFocusTarget(null);
    setFocusTargetValue(undefined);
    updateCellData(key, value)
    setRefMode(false);
  }

  /**
   * 포커싱된 셀의 커서 위치 제어
   */
  const moveFocusTargetCursor = (event) => {
    const length = inputRef.current.length;
    event.target.setSelectionRange(length, length);
  }

  /** 
   * 셀 언포커싱 이벤트 핸들러
   */
  const handlerUnfoucedTarget = (i, j, event) => {
    if (refMode) return;
    exitTextEditor(focusTarget)
  };

  /** 
   * 셀 키 입력 이벤트 핸들러
   */
  const handlerKeyDown = (event, layer = true) => {
    // 단일 타겟(ex - TextField)의 이벤트 핸들러
    if (layer && event.key === 'Enter') {
      exitTextEditor(focusTarget);
    }
    // 대상 없는 시트 전체 이벤트 핸들러(시트 컴포넌트 한정)
    // 시트 이벤트 핸들러는 touchTarget이 무조건 존재함
    if (event.key === '`') { // DEBUG : 로그찍기용
      __DEBUG(cellValues)
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

  /**
   * 셀 텍스트 입력 제어 (플래그 제어용)
   */
  const handlerTextChange = (i, j, event) => {
    const value = event.target.value;
    if (!refMode && value.startsWith("="))
      setRefMode(true);
    else if (refMode && !value.startsWith("="))
      setRefMode(false);
    // 업뎃을 여기서 하면 안된다(렌더링 지연의 원인)
    inputRef.current = event.target.value;
  };

  /**
   * 레퍼런스 모드일때 값과 객체, html에 터치된 레퍼런스를 뒤에 붙여넣기함
   */
  const referenceMode = (i, j) => {
    if (!refMode) return;
    /* 진입 조건 정리
    1. handlerTextChange에서 첫글자 =를 감지
    2. refMode를 True로
    3. >>>button의 클릭기능 handlerDoubleClickCell을 대체함<<<
      - 클릭된 셀의 i, j를 받아옴
    4. onBlur를 막아야함
    */

    const target = findLastRef(inputRef.current);
    const key = `$${i}$${j}`;
    setFocusTargetValue(target + key) // Target 데이터 갱신필요
    focusTargetRef.current[focusTarget].value = target + key; // HTMLTextField 데이터 갱신필요
    inputRef.current = target + key // Object 데이터 갱신필요
    focusTargetRef.current[focusTarget].focus();
  };

  /**
   * 레퍼런스를 지우고 반환한다. 레퍼런스가 없다면 원본 반환
   */
  const findLastRef = (target) => {
    const regex = /\$([0-9]+)\$([0-9]+)/g;
    const lastRef = findLastMatchIndex(target, regex);
    if (target && lastRef) {
      if (target.substring(lastRef.index) === lastRef.value)
        target = target.substring(0, target.length - lastRef.value.length)
    }
    return target
  }

  /**
   * 마지막으로 매칭된 레퍼런스값의 정보를 반환한다
   */
  const findLastMatchIndex = (str, regex = /\$([0-9]+)\$([0-9]+)/g) => {
    let matchArray = [...str.matchAll(regex)];

    if (matchArray.length > 0) {
      const lastMatch = matchArray[matchArray.length - 1];
      return {
        value: lastMatch[0],
        index: lastMatch.index,
        total: matchArray.length
      };
    }
    return null;  // 매칭이 없을 때
  };

  /**
   * 문자판별함수 문자면 true
   */
  const isNumeric = (value) => !isNaN(value) && !isNaN(parseFloat(value));

  /**
   * 정규식문자의 문자열화 처리 (앞에 \붙여준다는 뜻)
   */
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  /**
   * 셀 주소 A, B를 받아 둘을 포함한 둘 사이의 주소를 배열로 반환하는 함수
   */
  const arrayReference = (refA, refB) => {
    const regex = /\$([0-9]+)\$([0-9]+)/g;
    const keyA = refA.match(regex);
    const keyB = refB.match(regex);
    const i_S = keyA[0] > keyA[1] ? keyA[1] : keyA[0];
    const i_E = keyA[0] < keyA[1] ? keyA[1] : keyA[0];
    const j_S = keyB[0] > keyB[1] ? keyB[1] : keyB[0];
    const j_E = keyB[0] < keyB[1] ? keyB[1] : keyB[0];
    let stack = [];
    for (let i = i_S; i <= i_E; i++)
      for (let j = j_S; j <= j_E; j++)
        stack.push(`$${i}$${j}`);
    return stack;
  }

  // 현행 : 문자열은 단순 +로 합침 / 계산식 괄호없음 << 완
  // 과도기 : 문자열 &로 합침 / 계산식 괄호추가 << 완
  // 완성 : 문자열 &로 합치는 대신 문자는 ""로 감싸기 << 안할란다 이건(엑셀에서 귀찮았던거니까)
  // 이하 우선순위에 대한 정렬임
  // 추가1 : 배열계산 << 일단은 필요가 없을듯 / 아니 필요하다 배열계산부터해야한다
  // 추가5 : AND OR NOT 커스텀 << 완
  // 추가2 : IF(A,B,C) 커스텀 << 완
  // 추가3 : SUM(A) ~ SUM(A:B) 커스텀
  // 추가4 : COUNT(A) ~ COUNT(A:B) 커스텀
  // 추가0 : 레퍼런스 계산
  /**
   * 셀 계산
   */
  const calFormula = (formula, funcall = 0) => {
    if (!formula?.startsWith("="))
      return formula;
    if (funcall > maximumsize)
      throw new Error(`순환 참조 오류 발생 ${funcall}번째 호출`);
    const target = formula.slice(1);
    let replacedTarget = target;
    let numericFlag = true; // 문자판별기
    // 함수레퍼런스 계산
    const regexFunction = /\b(AND|OR|NOT|IF|SUM|COUNT)\b/;
    if (regexFunction.test(target)) {
      // AND(A) OR(A) 계산
      const keys = [...target.matchAll(/(AND|OR)\(([^)]+)\)/g)];
      const matches = target.match(/(AND|OR)\([^)]+\)/g);
      let idx = 0;
      keys.forEach((match) => {
        const key = match[1];
        const value = match[1].match(/\$([0-9]+)\$([0-9]+)/g) ? calFormula(cellValues[key], funcall + 1) : key;
        replacedTarget = replacedTarget.replace(
          new RegExp(escapeRegExp(matches[idx++]), "g"),
          !(!value) ? 1 : 0);
      });
      // NOT(A) 계산
      const keysNot = [...target.matchAll(/NOT\(([^)]+)\)/g)];
      const matchesNot = target.match(/NOT\([^)]+\)/g);
      idx = 0;
      keysNot.forEach((match) => {
        const key = match[1];
        const value = match[1].match(/\$([0-9]+)\$([0-9]+)/g) ? calFormula(cellValues[key], funcall + 1) : key;
        replacedTarget = replacedTarget.replace(
          new RegExp(escapeRegExp(matchesNot[idx++]), "g"),
          !value ? 1 : 0);
      });
      // AND(A:B) 계산
      const keysArrAnd = [...target.matchAll(/AND\(([^:]+):([^)]+)\)/g)];
      const matchesArrAnd = target.match(/AND\([^:]+:[^)]+\)/g);
      idx = 0;
      keysArrAnd.forEach((match) => {
        let result = true;
        const keys = arrayReference(match[1], match[2]);
        for (const key of keys) {
          const value = calFormula(cellValues[key], funcall + 1);
          result &= value;
        }
        replacedTarget = replacedTarget.replace(
          new RegExp(escapeRegExp(matchesArrAnd[idx++]), "g"),
          result ? 1 : 0);
      });
      // OR(A:B) 계산
      const keysArrOr = [...target.matchAll(/OR\(([^:]+):([^)]+)\)/g)];
      const matchesArrOr = target.match(/OR\([^:]+:[^)]+\)/g);
      idx = 0;
      keysArrOr.forEach((match) => {
        let result = false;
        const keys = arrayReference(match[1], match[2]);
        for (const key of keys) {
          const value = calFormula(cellValues[key], funcall + 1);
          result |= value;
        }
        replacedTarget = replacedTarget.replace(
          new RegExp(escapeRegExp(matchesArrOr[idx++]), "g"),
          result ? 1 : 0);
      });
      // IF(A,B,C) 계산
      const keysArrIf = [...target.matchAll(/IF\(([^,]+),([^,]+),([^)]+)\)/g)];
      const matchesArrIf = target.match(/IF\([^,]+,[^,]+,[^)]+\)/g);
      idx = 0;
      keysArrIf.forEach((match) => {
        replacedTarget = replacedTarget.replace(
          new RegExp(escapeRegExp(matchesArrIf[idx++]), "g"),
          !(!calFormula(match[1], funcall + 1)) ? match[2] : match[3])
      });
      // SUM(A) 계산
      const keysSum = [...target.matchAll(/SUM\(([^)]+)\)/g)];
      const matchesSum = target.match(/SUM\([^)]+\)/g);
      idx = 0;
      keysSum.forEach((match) => {
        const key = match[1];
        const value = match[1].match(/\$([0-9]+)\$([0-9]+)/g) ? calFormula(cellValues[key], funcall + 1) : key;
        replacedTarget = replacedTarget.replace(
          new RegExp(escapeRegExp(matchesSum[idx++]), "g"),
          value);
      });
    }

    // 단일레퍼런스 계산
    const regex = /\$([0-9]+)\$([0-9]+)/g; // $n$n을 모두(g) 검색
    const keys = [...new Set(target.matchAll(regex))]; // 검색결과 정리
    let combineTarget = target.replaceAll('&', '');

    // 단일레퍼런스 치환
    keys.forEach((match) => {
      const key = `$${match[1]}$${match[2]}`;
      const numValue = calFormula(cellValues[key], funcall + 1) || 0;
      const strValue = calFormula(cellValues[key], funcall + 1) || '';
      numericFlag &= isNumeric(numValue); // 문자판별중
      replacedTarget = replacedTarget.replaceAll(key, numValue);
      combineTarget = combineTarget.replaceAll(key, strValue);
    });

    if (!numericFlag) // 문자 감지됨 escape
      return combineTarget;

    const parts = replacedTarget.split(/([()+\-*/])/).filter(Boolean); // 사칙연산분리 및 빈배열 처리
    const result = calRecursiveBracket(parts);
    return result;
  }

  // 재귀적 괄호 처리
  const calRecursiveBracket = (parts) => {
    let stack = [];
    let opCurrent = '+';

    while (parts.length) {
      let part = parts.shift();

      if (part === '(') {
        const subResult = calRecursiveBracket(parts);
        stack.push(subResult);
      } else if (part === ')') {
        break;
      } else if (['+', '-', '*', '/'].includes(part)) {
        opCurrent = part;
      } else if (!isNaN(part)) {
        let value = parseFloat(part);

        switch (opCurrent) {
          case '+':
            stack.push(value);
            break;
          case '-':
            stack.push(-value);
            break;
          case '*':
            stack[stack.length - 1] *= value;
            break;
          case '/':
            stack[stack.length - 1] /= value;
            break;
          default:
            break;
        }
      }
    }

    return stack.reduce((acc, val) => acc + val, 0);
  }

  return (
    <div className='sheet-body' onKeyDown={(event) => handlerKeyDown(event, false)} style={{ height: `calc(100vh - ${toolbarHeight}px)`, overflow: 'auto' }}>
      <Grid className='grid-container' container spacing={0}>
        {!loading ? (
          gridIndex.map(({ i, j }) => (
            <Grid className={'grid-item' + (touchTarget === `$${i}$${j}` ? ' cell-focused' : '')} item xs={12 / sizeOfSheet} key={`$${i}$${j}`}>
              {focusTarget === `$${i}$${j}` ? (
                <TextField
                  onBlur={(event) => handlerUnfoucedTarget(i, j, event)}
                  onChange={(event) => handlerTextChange(i, j, event)}
                  onKeyDown={(event) => handlerKeyDown(event)}
                  onFocus={(event) => moveFocusTargetCursor(event)}
                  inputRef={(e) => (focusTargetRef.current[`$${i}$${j}`] = e)}
                  defaultValue={focusTargetValue}
                  className='cell-body'
                  slotProps={{
                    htmlInput: {
                      maxLength: 255,
                    },
                  }}
                  variant="outlined" multiline fullWidth autoFocus />
              ) : (
                <Tooltip title={`${i}-${j}`} >
                  <Button
                    onDoubleClick={() => handlerDoubleClickCell(i, j)}
                    onClick={() => handlerClickCell(i, j)}
                    className='cell-cover'
                    variant="text">
                    {calFormula(cellValues[`$${i}$${j}`]) || ''}
                  </Button>
                </Tooltip>
              )}
            </Grid>
          ))
        ) : (
          <div>
            <Skeleton variant='rectangular' animation="wave" width="100%" height="100vh" />
            <LinearProgress />
          </div>
        )
        }
      </Grid>
    </div >
  );
});

export default Sheets;