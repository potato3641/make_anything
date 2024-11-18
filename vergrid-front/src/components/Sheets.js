import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import CellMenu from './CellMenu';
import CellReserved from './CellReserved';
import CheckField from './CheckField';
import './Sheets.css';

const DEBUG_FLAG = true;
const __DEBUG = (msg) => DEBUG_FLAG ? console.log(msg) : msg;
const __REGEX = /\$([0-9]+)\$([0-9]+)/g;
const __REGEx = /\$([0-9]+)\$([0-9]+)/;

// 왜 linter disable 했냐면 함수식에 (, )가 들어가는걸 이해 못해서 자꾸 오류발생시킴
/* eslint-disable */
const __REGEX_FUNCTION = {
  AND: /^AND\((?:\w+\([^\)]*\)|\w+|\$\d+\$\d+)(?:,(?:\w+\([^\)]*\)|\w+|\$\d+\$\d+))*\)$/g,
  OR: /^OR\((?:\w+\([^\)]*\)|\w+|\$\d+\$\d+)(?:,(?:\w+\([^\)]*\)|\w+|\$\d+\$\d+))*\)$/g,
  NOT: /NOT\([^)]+\)/g,
  IF: /IF\([^,]+,[^,]+,[^)]+\)/g,
  SUM: /^SUM\((?:\w+\([^\)]*\)|\w+|\$\d+\$\d+)(?:,(?:\w+\([^\)]*\)|\w+|\$\d+\$\d+))*\)$/g,
  COUNTA: /^COUNTA\((?:\w+\([^\)]*\)|\w+|\$\d+\$\d+)(?:,(?:\w+\([^\)]*\)|\w+|\$\d+\$\d+))*\)$/g,
  ARR_AND: /AND\([^:]+:[^)]+\)/g,
  ARR_OR: /OR\([^:]+:[^)]+\)/g,
  ARR_SUM: /SUM\([^:]+:[^)]+\)/g,
  ARR_COUNTA: /COUNTA\([^:]+:[^)]+\)/g,
  // 한글 매칭 안되는 문제로 \w+ -> [\w\u3131-\uD79D]+ 변경됨
  // COMPARE_FIND: /(?:\w+\([^\)]*\)|\([^\)]*\)|\$\d+\$\d+|\w+)\s*(?:==|<|<=|>|>=|!==)\s*(?:\w+\([^\)]*\)|\([^\)]*\)|\$\d+\$\d+|\w+)/g
  // COMPARE: /(\w+\([^\)]*\)|\([^\)]*\)|\$\d+\$\d+|\w+)\s*(==|<|<=|>|>=|!==)\s*(\w+\([^\)]*\)|\([^\)]*\)|\$\d+\$\d+|\w+)/
  COMPARE_FIND: /(?:[\w\u3131-\uD79D]+\([^\)]*\)|\([^\)]*\)|\$\d+\$\d+|[\w\u3131-\uD79D]+)\s*(?:==|<|<=|>|>=|!==)\s*(?:[\w\u3131-\uD79D]+\([^\)]*\)|\([^\)]*\)|\$\d+\$\d+|[\w\u3131-\uD79D]+)/g,
  COMPARE: /([\w\u3131-\uD79D]+\([^\)]*\)|\([^\)]*\)|\$\d+\$\d+|[\w\u3131-\uD79D]+)\s*(==|<|<=|>|>=|!==)\s*([\w\u3131-\uD79D]+\([^\)]*\)|\([^\)]*\)|\$\d+\$\d+|[\w\u3131-\uD79D]+)/,
  FOUROP: /(\$\d+\$\d+|\d+)\s*([\*\/\+\-])\s*(\$\d+\$\d+|\d+)/,
}
/* eslint-enable */

const Sheets = forwardRef(({ size, toolbarHeight, loader, inheritData, inheritSetting }, ref) => {
  const sizeOfSheet = size;
  const gridIndex = [];
  const maximumsize = 1000;
  for (let i = 0; i < sizeOfSheet; i++) {
    for (let j = 0; j < sizeOfSheet; j++) {
      gridIndex.push({ i, j });
    }
  }
  // out of sheet
  const [anchorEl, setAnchorEl] = useState(null); // Target of cell function
  const [openMenu, setOpenMenu] = useState(false); // cell function Menu opener
  const [openReserve, setOpenReserve] = useState(false); // cell function Reserve opener

  const [loading, setLoading] = useState(true); // sheet loading
  const [refMode, setRefMode] = useState(false); // Flag of Reference Mode
  const [cellValues, setCellValues] = useState(inheritData || {}); // Sheet Live Value
  const [cellSettings, setCellSettings] = useState(inheritSetting || {}); // Sheet Live Setting
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
    },
    getCellSettings() {
      return cellSettings;
    },
    delPrevSettings() {
      setCellSettings({});
    },
  }));

  useEffect(() => {
    setLoading(true);
    setCellValues(() => inheritData || {});
    setCellSettings(() => inheritSetting || {});
  }, [inheritData, inheritSetting]);

  useEffect(() => {
    if (cellValues && cellSettings) {
      loader();
      setLoading(false);
    }
  }, [cellValues, cellSettings, loader]);

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
  const handlerClickCell = (event, i, j, key = `$${i}$${j}`) => {
    if (cellSettings[key] && cellSettings[key]?.perpose === 1) { // check?
      if (refMode) {
        referenceMode(i, j);
      } else {
        setTouchTarget(key);
      }
    } else if (touchTarget === key) { // touch한 셀 클릭 시 편집모드
      openTextEditor(key);
    } else if (refMode && isReferenceOkay(focusTargetRef.current[focusTarget]?.value)) {
      // __DEBUG(isReferenceOkay(focusTargetRef.current[focusTarget]?.value))
      referenceMode(i, j);
    } else {
      exitTextEditor();
      setTouchTarget(key);
    }
  }

  /**
   * 셀 우클릭 이벤트 핸들러
   */
  const handlerRightClick = (event, i, j) => {
    const key = `$${i}$${j}`
    exitTextEditor();
    setTouchTarget(key);
    // open modal
    handlerOpenMenu(event);
  };

  /**
   * 우클릭 메뉴 오픈 이벤트 핸들러
   */
  const handlerOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  }

  /**
   * 우클릭 메뉴 닫기 이벤트 핸들러
   */
  const handlerCloseMenu = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  /**
   * 우클릭 메뉴 선택값 가져오는 이벤트 핸들러
   * 0 : 잘라내기
   * 1 : 복사하기
   * 2 : 붙여넣기
   * 3 : 지우기
   * 4 : 서식
   * 5 : 예약
   */
  const emitIdx = (idx) => {
    switch (idx) {
      case 0: // 잘라내기
        break;
      case 1: // 복사하기
        break;
      case 2: // 붙여넣기
        break;
      case 3: // 지우기
        handlerTextRemove();
        break;
      case 4: // 서식
        break;
      case 5: // 예약
        handlerOpenReserve();
        break;
      default:
        throw new Error(`incorrect index error`);
    }
  }

  /**
   * 우클릭 메뉴 - 예약 오픈 이벤트 핸들러
   */
  const handlerOpenReserve = () => {
    setOpenReserve(true);
  }

  /**
   * 우클릭 메뉴 - 예약 닫기 이벤트 핸들러
   */
  const handlerCloseReserve = () => {
    setOpenReserve(false);
  }

  /**
   * 우클릭 메뉴 - 예약 선택값 가져오는 이벤트 핸들러
   */
  const emitPeriodPerpose = (period, perpose) => {
    const today = new Date();
    const regex = __REGEx;
    const match = touchTarget.match(regex);
    const key = `$${match[1]}$${match[2]}`;
    updateCellSetting(key, period, perpose, today);
  }

  /**
   * 셀 세팅 업데이트
   */
  const updateCellSetting = (key, period, perpose, date) => {
    if (key)
      setCellSettings({
        ...cellSettings,
        [key]: {
          period: period,
          perpose: perpose,
          date: date,
        }
      });
  };

  /**
   * 셀 데이터(Value) 업데이트
   */
  const updateCellData = (key, value) => {
    if (key)
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
        val.charAt(val.length - 1) === ',' || // 함수 도중인지
        val.slice(val.length - 2, val.length) === '==' || // 함수 도중인지
        /^=.*\$\d+\$\d+:/.test(val) ||
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
    //DEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUG
    if (event.key === '`') { // DEBUG : 로그찍기용
      __DEBUG(cellValues)
      __DEBUG(cellSettings)
      console.log(focusTargetRef.current)
    } //DEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUGDEBUG
    // 대상 없는 시트 전체 이벤트 핸들러(시트 컴포넌트 한정)
    // 시트 이벤트 핸들러는 touchTarget이 무조건 존재함
    if (!layer && !(touchTarget === null)) {
      const regex = __REGEx;
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
        handlerTextRemove();
      }
    }
  };

  /** 
   * 터치 셀 데이터 삭제
   */
  const handlerTextRemove = () => {
    const regex = __REGEx;
    const match = touchTarget.match(regex);
    const key = `$${match[1]}$${match[2]}`;
    updateCellData(key, '');
  }

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
    const regex = __REGEX;
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
  const findLastMatchIndex = (str, regex = __REGEX) => {
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
  const escapeRegExp = (str) => new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");

  /**
   * 셀 주소 A, B를 받아 둘을 포함한 둘 사이의 주소를 배열로 반환하는 함수
   */
  const arrayReference = (refA, refB) => {
    const regex = __REGEx;
    const keyA = refA.match(regex);
    const keyB = refB.match(regex);
    const i_S = parseFloat(keyA[1]) > parseFloat(keyA[2]) ? parseFloat(keyA[2]) : parseFloat(keyA[1]);
    const j_S = parseFloat(keyA[1]) < parseFloat(keyA[2]) ? parseFloat(keyA[2]) : parseFloat(keyA[1]);
    const i_E = parseFloat(keyB[1]) > parseFloat(keyB[2]) ? parseFloat(keyB[2]) : parseFloat(keyB[1]);
    const j_E = parseFloat(keyB[1]) < parseFloat(keyB[2]) ? parseFloat(keyB[2]) : parseFloat(keyB[1]);
    let stack = [];
    for (let i = i_S; i <= i_E; i++)
      for (let j = j_S; j <= j_E; j++)
        stack.push(`$${i}$${j}`);
    return stack;
  }

  /**
   * 셀 함수 계산 (전체)
   */
  const calSheetFunction = (targetFunction, replacedTarget, funcall) => {
    const __AND_INIT = (val) => !(!val);
    const __AND_CAL = (val, next) => val & next;
    const __AND_RST = (val) => !(!val);
    const __OR_INIT = (val) => !(!val);
    const __OR_CAL = (val, next) => val | next;
    const __OR_RST = (val) => !(!val);
    const __NOT_INIT = (val) => val;
    const __NOT_CAL = (val, next) => val;
    const __NOT_RST = (val) => !val;
    const __SUM_INIT = (val) => 0;
    const __SUM_CAL = (val, next) => parseFloat(val) + parseFloat(next);
    const __SUM_RST = (val) => val;
    const __IF_INIT = (val) => val;
    const __IF_CAL = (val, next) => val;
    const __IF_RST = (val, valTrue, valFalse) => val ? valTrue : valFalse;
    const __COUNTA_INIT = (val) => 1;
    const __COUNTA_CAL = (val, next) => val++;
    const __COUNTA_RST = (val) => val;

    let explorer = null;

    explorer = targetFunction.match(__REGEX_FUNCTION.ARR_COUNTA);
    if (explorer) // COUNTA:
      explorer.forEach((target) => replacedTarget = calCellFunction(target, replacedTarget, 'ARR_COUNTA', __COUNTA_INIT, __COUNTA_CAL, __COUNTA_RST, funcall));

    explorer = targetFunction.match(__REGEX_FUNCTION.COUNTA);
    if (explorer) // COUNTA
      explorer.forEach((target) => replacedTarget = calCellFunction(target, replacedTarget, 'COUNTA', __COUNTA_INIT, __COUNTA_CAL, __COUNTA_RST, funcall));

    explorer = targetFunction.match(__REGEX_FUNCTION.ARR_AND);
    if (explorer) // AND:
      explorer.forEach((target) => replacedTarget = calCellFunction(target, replacedTarget, 'ARR_AND', __AND_INIT, __AND_CAL, __AND_RST, funcall));

    explorer = targetFunction.match(__REGEX_FUNCTION.ARR_OR);
    if (explorer) // OR:
      explorer.forEach((target) => replacedTarget = calCellFunction(target, replacedTarget, 'ARR_OR', __OR_INIT, __OR_CAL, __OR_RST, funcall));

    explorer = targetFunction.match(__REGEX_FUNCTION.AND);
    if (explorer) // AND
      explorer.forEach((target) => replacedTarget = calCellFunction(target, replacedTarget, 'AND', __AND_INIT, __AND_CAL, __AND_RST, funcall));

    explorer = targetFunction.match(__REGEX_FUNCTION.OR);
    if (explorer) // OR
      explorer.forEach((target) => replacedTarget = calCellFunction(target, replacedTarget, 'OR', __OR_INIT, __OR_CAL, __OR_RST, funcall));

    explorer = targetFunction.match(__REGEX_FUNCTION.NOT);
    if (explorer) // NOT
      explorer.forEach((target) => replacedTarget = calCellFunction(target, replacedTarget, 'NOT', __NOT_INIT, __NOT_CAL, __NOT_RST, funcall));

    explorer = targetFunction.match(__REGEX_FUNCTION.IF);
    if (explorer) // IF
      explorer.forEach((target) => replacedTarget = calCellFunction(target, replacedTarget, 'IF', __IF_INIT, __IF_CAL, __IF_RST, funcall));

    explorer = targetFunction.match(__REGEX_FUNCTION.ARR_SUM);
    if (explorer) // SUM:
      explorer.forEach((target) => replacedTarget = calCellFunction(target, replacedTarget, 'ARR_SUM', __SUM_INIT, __SUM_CAL, __SUM_RST, funcall));

    explorer = targetFunction.match(__REGEX_FUNCTION.SUM);
    if (explorer) // SUM
      explorer.forEach((target) => replacedTarget = calCellFunction(target, replacedTarget, 'SUM', __SUM_INIT, __SUM_CAL, __SUM_RST, funcall));

    return replacedTarget;
  }

  /**
   * 셀 함수 계산 (단일)
   */
  const calCellFunction = (target, replacedTarget, name, init, cal, rst, funcall) => {
    const arrayChecker = /ARR/;
    const ifChecker = /IF/;
    const arr_flag = !(!arrayChecker.test(name));
    const if_flag = ifChecker.test(name);
    // 왜 linter disable 했냐면 함수식에 (, )가 들어가는걸 이해 못해서 자꾸 오류발생시킴
    /* eslint-disable */
    const getNameForArr = /^.+_(.+)$/;
    const match = name.match(getNameForArr);
    if (match)
      name = match[1];
    const pre_inside = () => {
      if (arr_flag)
        return target.match(new RegExp(`${name}\\(([^:]+):([^)]+)\\)`));
      if (if_flag)
        return target.match(new RegExp(`${name}\\(([^,]+),([^,]+),([^)]+)\\)`));
      return target.match(new RegExp(`${name}\\((.*)\\)$`));
    }
    /* eslint-enable */
    const inside = pre_inside();
    const pre_parts = () => {
      if (arr_flag)
        return [...arrayReference(inside[1], inside[2])];
      if (if_flag)
        return [calFormula(inside[1], funcall + 1), calFormula(inside[2], funcall + 1), calFormula(inside[3], funcall + 1)]
      return inside[1].match(/(\w+\([^()]*\)|\$\d+\$\d+|\w+)/g);
    }
    const parts = pre_parts();
    // __DEBUG(target);
    // __DEBUG(inside);
    // __DEBUG(parts);

    let value = parseFloat(init(parts[0].match(__REGEX) ? calFormula(cellValues[parts[0]], funcall + 1) : parts[0]));
    if (!if_flag)
      for (const part of parts)
        value = parseFloat(cal(value, part.match(__REGEX) ? calFormula(cellValues[part], funcall + 1) : calFormula(part)));
    replacedTarget = replacedTarget.replace(
      escapeRegExp(target),
      if_flag ? rst(value, parts[1], parts[2]) : rst(value));
    return replacedTarget
  }

  /**
   * 문자 포함 값 비교연산
   */
  const compareFormula = (left, compare, right, funcall) => {
    let result;
    left = left.match(__REGEx) ? calFormula(cellValues[left], funcall + 1) : left;
    right = right.match(__REGEx) ? calFormula(cellValues[right], funcall + 1) : right;
    const numLeft = parseFloat(left);
    const numRight = parseFloat(right);
    if (!(numLeft && numRight)) {
      if (compare === "==")
        return left === right ? '1' : '0' // 혹시 문제되면 다시 숫자로
      if (compare === "!==")
        return left !== right ? '1' : '0'
    }
    switch (compare) {
      case "!==":
        result = (numLeft !== numRight);
        break;
      case "<=":
        result = (numLeft <= numRight);
        break;
      case ">=":
        result = (numLeft >= numRight);
        break;
      case "==":
        result = (numLeft === numRight);
        break;
      case "<":
        result = (numLeft < numRight);
        break;
      case ">":
        result = (numLeft > numRight);
        break;
      default:
        throw new Error(`비교연산 오류 발생 ${funcall}번째 호출`)
    }
    return result ? 1 : 0;
  }

  // 현행 : 문자열은 단순 +로 합침 / 계산식 괄호없음 << 완
  // 과도기 : 문자열 &로 합침 / 계산식 괄호추가 << 완
  // 완성 : 문자열 &로 합치는 대신 문자는 ""로 감싸기 << 안할란다 이건(엑셀에서 귀찮았던거니까)
  // 이하 우선순위에 대한 정렬임
  // 추가1 : 배열계산 << 일단은 필요가 없을듯 / 아니 필요하다 배열계산부터해야한다
  // 추가5 : AND OR NOT 커스텀 << 완
  // 추가2 : IF(A,B,C) 커스텀 << 완
  // 추가3 : SUM(A) ~ SUM(A:B) 커스텀 << 완
  // 추가4 : COUNTA(A) ~ COUNTA(A:B) 커스텀 << 완
  // 추가0 : 레퍼런스 계산 << 완
  // 기타 : 조건식 IF절에서 ==,<,<=,>,>=,!== 뭐 이런거 해야함 및 발견되는 오류 수정
  /**
   * 셀 계산
   */
  const calFormula = (formula, funcall = 0) => {
    if (!isNaN(formula)) // you are num
      return formula
    if (!formula?.startsWith("=")) // you are str
      return formula;
    if (funcall > maximumsize)
      throw new Error(`순환 참조 오류 발생 ${funcall}번째 호출`);
    const target = formula.slice(1);
    let replacedTarget = target;
    let numericFlag = true; // 문자판별기

    // 단순 사칙연산 선행처리
    // 조건연산 이전 조건사칙연산 수행을 위한 4종 연산 처리
    // 근데 이거 연산 이후 (n)도 검토해야하지 않을까? ALERT
    const regexFourop = __REGEX_FUNCTION.FOUROP;
    while (regexFourop.test(replacedTarget)) {
      const match = replacedTarget.match(__REGEX_FUNCTION.FOUROP);
      if (!match)
        break;
      const left = parseFloat(match[1].match(__REGEx) ? calFormula(cellValues[match[1]], funcall + 1) : match[1]);
      const right = parseFloat(match[3].match(__REGEx) ? calFormula(cellValues[match[3]], funcall + 1) : match[3]);
      let result = 0;
      switch (match[2]) {
        case '+':
          result = left + right;
          break;
        case '-':
          result = left - right;
          break;
        case '*':
          result = left * right;
          break;
        case '/':
          result = left / right;
          break;
        default:
          throw new Error(`선행 사칙연산 오류 발생 ${funcall}번째 호출`);
      }
      replacedTarget = replacedTarget.replace(
        match[0],
        result
      )
    }

    // __DEBUG(`first : ${replacedTarget}`)
    // 비교연산 조건처리
    const regexCompare = __REGEX_FUNCTION.COMPARE_FIND;
    if (regexCompare.test(replacedTarget)) {
      const matches = replacedTarget.match(__REGEX_FUNCTION.COMPARE_FIND);
      matches.forEach(() => {
        const match = replacedTarget.match(__REGEX_FUNCTION.COMPARE);
        replacedTarget = replacedTarget.replace(
          escapeRegExp(match[0]),
          compareFormula(match[1], match[2], match[3], funcall + 1)
        )
      })
    }

    // __DEBUG(`after compare : ${replacedTarget}`);
    // 함수레퍼런스 계산
    const regexFunction = /\b(AND|OR|NOT|IF|SUM|COUNTA)\b/;
    if (regexFunction.test(replacedTarget))
      replacedTarget = calSheetFunction(replacedTarget, replacedTarget, funcall);
    // if (regexFunction.test(replacedTarget))
    //   throw new Error(`함수 오류 발생 ${funcall}번째 호출`);

    // __DEBUG(`after func : ${replacedTarget}`);
    // 단일레퍼런스 계산
    const regex = __REGEX; // $n$n을 모두(g) 검색
    const keys = [...new Set(target.matchAll(regex))]; // 검색결과 정리
    let combineTarget = target.replaceAll('&', '');
    keys.forEach((match) => {
      const key = `$${match[1]}$${match[2]}`;
      const numValue = parseFloat(calFormula(cellValues[key], funcall + 1)) || 0;
      const strValue = calFormula(cellValues[key], funcall + 1) || '';
      numericFlag &= isNumeric(numValue); // 문자판별중
      replacedTarget = replacedTarget.replaceAll(key, numValue);
      combineTarget = combineTarget.replaceAll(key, strValue);
    });

    // __DEBUG(`after ref : ${replacedTarget}`);
    if (!numericFlag) // 문자 감지됨 escape
      return combineTarget;

    // __DEBUG(`after str : ${replacedTarget}`);
    // 사칙연산 및 괄호처리
    if (/([()+\-*/])/.test(replacedTarget)) {
      const parts = replacedTarget.split(/([()+\-*/])/).filter(Boolean); // 사칙연산분리 및 빈배열 처리
      const result = calRecursiveBracket(parts);
      // __DEBUG(`after 연산 : ${replacedTarget}`);
      return result;
    }
    return replacedTarget;
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

    let result = 0;
    for (const val of stack) {
      result += val;
    }
    return result;
  }

  const preRenderContent = (i, j) => {
    const key = `$${i}$${j}`;
    switch (cellSettings[key]?.perpose) {
      case 1: // CHECK
        return {
          type: "Check",
          component:
            <CheckField
              onBlur={(event) => handlerUnfoucedTarget(i, j, event)}
              toucher={handlerClickCell}
              updater={updateCellData}
              adr={[i, j]}
              ref={(e) => (focusTargetRef.current[`$${i}$${j}`] = e)}
            />
        };
      case 2: // COUNTER
      case 3: // CHECK-COUNTER
      default:
        return {
          type: "Text",
          component:
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
              variant="outlined" multiline fullWidth autoFocus
            />
        };
    }
  }

  return (
    <div className='sheet-body' onKeyDown={(event) => handlerKeyDown(event, false)} style={{ height: `calc(100vh - ${toolbarHeight}px)`, overflow: 'auto' }}>
      <Grid className='grid-container' container spacing={0}>
        {!loading ? (
          gridIndex.map(({ i, j }) => (
            <Grid className={'grid-item' + (touchTarget === `$${i}$${j}` ? ' cell-focused' : '')} item xs={12 / sizeOfSheet} key={`$${i}$${j}`}>
              {(() => {
                const rendering = preRenderContent(i, j);
                switch (rendering.type) {
                  case "Check":
                    return rendering.component;
                  case "Text":
                    return focusTarget === `$${i}$${j}` ? rendering.component :
                      <Tooltip title={`${i}-${j}`} >
                        <Button
                          onDoubleClick={() => handlerDoubleClickCell(i, j)}
                          onClick={(event) => handlerClickCell(event, i, j)}
                          onContextMenu={(event) => handlerRightClick(event, i, j)}
                          className='cell-cover'
                          variant="text">
                          {calFormula(cellValues[`$${i}$${j}`]) ?? ''}
                        </Button>
                      </Tooltip>
                  default:
                    return null;
                }
              })()}
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
      <CellMenu open={openMenu} anchorEl={anchorEl} emit={emitIdx} handlerClose={handlerCloseMenu} />
      <CellReserved open={openReserve} emit={emitPeriodPerpose} handlerClose={handlerCloseReserve} />
    </div>
  );
});

export default Sheets;