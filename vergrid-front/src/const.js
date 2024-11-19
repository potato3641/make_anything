import { ContentCut, ContentCopy, ContentPaste, Delete, Settings } from '@mui/icons-material';
import Filter1RoundedIcon from '@mui/icons-material/Filter1Rounded';
import Filter2RoundedIcon from '@mui/icons-material/Filter2Rounded';
import Filter3RoundedIcon from '@mui/icons-material/Filter3Rounded';
import Filter4RoundedIcon from '@mui/icons-material/Filter4Rounded';
import Filter5RoundedIcon from '@mui/icons-material/Filter5Rounded';
import Filter6RoundedIcon from '@mui/icons-material/Filter6Rounded';
import Filter7RoundedIcon from '@mui/icons-material/Filter7Rounded';
import Filter8RoundedIcon from '@mui/icons-material/Filter8Rounded';
import Filter9RoundedIcon from '@mui/icons-material/Filter9Rounded';

export const __REGEX = /\$([0-9]+)\$([0-9]+)/g;
export const __REGEx = /\$([0-9]+)\$([0-9]+)/;
// 왜 linter disable 했냐면 함수식에 (, )가 들어가는걸 이해 못해서 자꾸 오류발생시킴
/* eslint-disable */
export const __REGEX_FUNCTION = {
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
};
/* eslint-enable */
export const PERIOD_TEXT = [
  '무기한',
  '상속',
  '일간',
  '주간',
  '격주',
]
export const PERPOSE_TEXT = [
  'Text',
  'Check',
  'Counter',
]
export const COLORBG_TEXT = [
  'WHITE',
  'GRAY',
  'BLACK',
  'RED',
  'BLUE',
  'GREEN',
  'CYAN',
  'MAGENTA',
  'YELLOW',
  '#FFCCCC',
  '#CCECFF',
  '#CCFFCC',
  '#CCFFFF',
  '#FFCCFF',
  '#FFFFCC',
  'TOMATO',
  'NAVY',
  'OLIVE',
];
export const COLORFT_TEXT = [
  'BLACK',
  'GRAY',
  'WHITE',
  'RED',
  'BLUE',
  'GREEN',
  'CYAN',
  'MAGENTA',
  'YELLOW',
  '#FFCCCC',
  '#CCECFF',
  '#CCFFCC',
  '#CCFFFF',
  '#FFCCFF',
  '#FFFFCC',
  'TOMATO',
  'NAVY',
  'OLIVE',
];
export const RIGHT_CLICK_OPTIONS = [
  '잘라내기',
  '복사하기',
  '붙여넣기',
  '지우기',
  '설정',
];
export const RIGHT_CLICK_ICONS = [
  <ContentCut fontSize="small" />,
  <ContentCopy fontSize="small" />,
  <ContentPaste fontSize="small" />,
  <Delete fontSize="small" />,
  <Settings fontSize="small" />,
]
export const icons = [
  <Filter1RoundedIcon />,
  <Filter2RoundedIcon />,
  <Filter3RoundedIcon />,
  <Filter4RoundedIcon />,
  <Filter5RoundedIcon />,
  <Filter6RoundedIcon />,
  <Filter7RoundedIcon />,
  <Filter8RoundedIcon />,
  <Filter9RoundedIcon />,
]