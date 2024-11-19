import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { RIGHT_CLICK_OPTIONS, RIGHT_CLICK_ICONS } from '../const.js'
import './CellMenu.css';

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