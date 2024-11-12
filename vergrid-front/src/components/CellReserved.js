import React, { useState } from 'react';
import { Modal, Box, Fade, Backdrop } from '@mui/material';
import { ToggleButton, ToggleButtonGroup, Button } from '@mui/material';
import './CellReserved.css';

const PERIOD_TEXT = [
  '무기한',
  '상속',
  '일간',
  '주간',
  '격주',
]

const PERPOSE_TEXT = [
  '텍스트',
  '체크',
  '카운터',
  '체크카운터',
]

const CellReserved = ({ open, emit, handlerClose }) => {

  const [alignPeriod, setAlignPeriod] = useState(PERIOD_TEXT[0]);
  const [alignPerpose, setAlignPerpose] = useState(PERPOSE_TEXT[0]);

  const handleAlignPeriod = (event, newAlignPeriod) => {
    setAlignPeriod(newAlignPeriod);
  };
  const handleAlignPerpose = (event, newAlignPerpose) => {
    setAlignPerpose(newAlignPerpose);
  };
  const handlerReservedClick = () => {
    emit(PERIOD_TEXT.indexOf(alignPeriod), PERPOSE_TEXT.indexOf(alignPerpose));
    handlerClose();
    setAlignPeriod(PERIOD_TEXT[0]);
    setAlignPerpose(PERPOSE_TEXT[0]);
  }

  return (
    <Modal
      open={open}
      onClose={handlerClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          TransitionComponent: Fade,
        },
      }}
    >

      <Fade in={open}>
        <Box
          className="reserve-box"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <ToggleButtonGroup
            value={alignPeriod}
            exclusive
            onChange={handleAlignPeriod}
            sx={{
              m: 1
            }}
          >
            {PERIOD_TEXT.map((text, idx) => (
              <ToggleButton value={text} key={idx}>
                {text}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={alignPerpose}
            exclusive
            onChange={handleAlignPerpose}
            sx={{
              m: 1
            }}
          >
            {PERPOSE_TEXT.map((text, idx) => (
              <ToggleButton value={text} key={idx}>
                {text}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Box
            sx={{
              m: 1
            }}>
            <Button
              sx={{ mr: 1, ml: 1, mb: 1 }}
              variant="contained"
              onClick={handlerReservedClick}
            >Confirm</Button>
            <Button
              sx={{ mr: 1, ml: 1, mb: 1 }}
              variant="outlined"
              onClick={handlerClose}
            >Cancel</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CellReserved;