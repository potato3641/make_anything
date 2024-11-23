import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Fab, Typography } from '@mui/material';
import { Navigation, Replay } from '@mui/icons-material';
import { COLORFT_TEXT, COLORBG_TEXT } from '../const.js'
import './CounterField.css';

const CounterField = forwardRef(({ onBlur, toucher, updater, onRightClick, clrft, clrbg, adr }, ref) => {
  const [count, setCount] = useState(0);
  useImperativeHandle(ref, () => ({
    value: count,
  }));
  return (
    <Fab
      onContextMenu={onRightClick}
      onClick={() => toucher(null, adr[0], adr[1])}
      onBlur={onBlur}
      ref={ref}
      sx={{
        '&:hover': {
          backgroundColor: (theme) =>
            `${theme.palette.primary.main}40`,
        },
        backgroundColor: COLORBG_TEXT[clrbg],
        borderRadius: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Navigation
        sx={{ mr: 1, color: COLORFT_TEXT[clrft] }}
        onClick={() => setCount((val) => { updater(`$${adr[0]}$${adr[1]}`, val + 1); return val + 1; })}
      />
      <Typography variant="h6" sx={{ color: COLORFT_TEXT[clrft] }}>{count}</Typography>
      <Replay
        sx={{ ml: 1, color: COLORFT_TEXT[clrft] }}
        onClick={() => setCount((val) => { updater(`$${adr[0]}$${adr[1]}`, 0); return 0 })}
      />
    </Fab >
  );
});

export default CounterField;