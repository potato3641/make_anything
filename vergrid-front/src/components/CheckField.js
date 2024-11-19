import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { ToggleButton } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { COLORFT_TEXT } from '../const.js'
import './CheckField.css';

const CheckField = forwardRef(({ onBlur, toucher, updater, onRightClick, clr, adr }, ref) => {
  const [selected, setSelected] = useState(false);
  useImperativeHandle(ref, () => ({
    value: selected ? 1 : 0,
  }));
  return (
    <ToggleButton
      color="info"
      value="check"
      selected={selected}
      onChange={() => setSelected((val) => { toucher(null, adr[0], adr[1]); updater(`$${adr[0]}$${adr[1]}`, !val + 0); return !val })}
      onContextMenu={onRightClick}
      onBlur={onBlur}
      ref={ref}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {selected ? (<Check sx={{ color: COLORFT_TEXT[clr] }} />) : (<Close sx={{ color: COLORFT_TEXT[clr] }} />)}
    </ToggleButton>
  );
});

export default CheckField;