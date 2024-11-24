import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import { COLORFT_TEXT, COLORBG_TEXT } from '../const.js'
import './CheckListField.css';

const CheckListField = forwardRef(({ defaultValue, onBlur, toucher, updater, onRightClick, clrft, clrbg, content, adr }, ref) => {
  const [message, setMessage] = useState(content || 'check');
  const [checked, setChecked] = useState(!(!defaultValue) || false);
  useImperativeHandle(ref, () => ({
    message: message,
    checked: checked ? 1 : 0,
  }));
  useEffect(() => {
    setMessage(() => content || 'check');
  }, [content]);
  useEffect(() => {
    setChecked(() => !(!defaultValue) || false)
  }, [defaultValue])
  return (
    <FormControlLabel
      className='shadow-effect'
      onContextMenu={onRightClick}
      onBlur={onBlur}
      checked={checked}
      ref={ref}
      onChange={() => setChecked((val) => { toucher(null, adr[0], adr[1]); updater(`$${adr[0]}$${adr[1]}`, !val + 0); return !val })}
      sx={{
        backgroundColor: COLORBG_TEXT[clrbg],
        m: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
      }}
      control={
        <Checkbox
          sx={{
            color: COLORFT_TEXT[clrft],
            '& .MuiSvgIcon-root': {
              fontSize: 28
            },
            '&.Mui-checked': {
              color: COLORFT_TEXT[clrft],
            }
          }}
        />
      }
      label={message}
    />
  );
});

export default CheckListField;