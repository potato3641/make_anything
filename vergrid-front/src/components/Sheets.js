import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './Sheets.css';

const Sheets = () => {
  const gridIndex = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      gridIndex.push({ i, j });
    }
  }

  const [cellValues, setCellValues] = useState({});
  const [focusTarget, setFocusTarget] = useState(null);

  const handlerSwitchCell = (i, j) => {
    setFocusTarget(`${i}-${j}`);
  };


  const handlerUnfoucedTarget = (i, j, event) => {
    setFocusTarget(null);
    const key = `${i}-${j}`;
    setCellValues({
      ...cellValues,
      [key]: event.target.value,
    });
    console.log(cellValues)
  };

  return (
    <div className='sheet-body'>
      <Grid className='grid-container' container spacing={0}>
        {gridIndex.map(({ i, j }) => (
          <Grid className='grid-item' item xs={12 / 10} key={`${i}-${j}`}>
            {focusTarget === `${i}-${j}` ? (
              <TextField
                value={cellValues[`${i}-${j}`] || ''}
                className='cell-body'
                onBlur={(event) => handlerUnfoucedTarget(i, j, event)}
                variant="outlined" multiline fullWidth autoFocus />
            ) : (
              <Button
                className='cell-cover'
                onClick={() => handlerSwitchCell(i, j)}
                variant="contained" fullwidth />
            )}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Sheets;