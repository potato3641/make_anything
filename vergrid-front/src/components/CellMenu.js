import React from 'react';
import './CellMenu.css';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { ContentCut, ContentCopy, ContentPaste, Delete, Alarm, FormatColorFill } from '@mui/icons-material';
const RIGHT_CLICK_OPTIONS = [
  '잘라내기',
  '복사하기',
  '붙여넣기',
  '지우기',
  '서식',
  '예약',
];
const RIGHT_CLICK_ICONS = [
  <ContentCut fontSize="small" />,
  <ContentCopy fontSize="small" />,
  <ContentPaste fontSize="small" />,
  <Delete fontSize="small" />,
  <FormatColorFill fontSize="small" />,
  <Alarm fontSize="small" />,
]

const CellMenu = ({ open, anchorEl, emit, handlerClose }) => {

  const handlerMenuItemClick = (idx) => {
    emit(idx);
    handlerClose();
  };
  return (
    <Menu
      id="lock-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handlerClose}
      MenuListProps={{
        'aria-labelledby': 'lock-button',
        role: 'listbox',
      }}
    >
      {RIGHT_CLICK_OPTIONS.map((option, idx) => (
        <MenuItem
          key={option}
          onClick={() => handlerMenuItemClick(idx)}
        >
          <ListItemIcon>
            {RIGHT_CLICK_ICONS[idx]}
          </ListItemIcon>
          <ListItemText>
            {option}
          </ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default CellMenu;