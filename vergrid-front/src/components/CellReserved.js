import React, { useState, useEffect } from 'react';
import { Modal, Box, Fade, Backdrop } from '@mui/material';
import { ToggleButton, ToggleButtonGroup, Button } from '@mui/material';
import { PERIOD_TEXT, PERPOSE_TEXT, COLORBG_TEXT, COLORFT_TEXT } from '../const.js'
import './CellReserved.css';

const CellReserved = ({ open, emit, handlerClose, initData }) => {

  const [alignPeriod, setAlignPeriod] = useState(initData?.period || PERIOD_TEXT[0]);
  const [alignPerpose, setAlignPerpose] = useState(initData?.perpose || PERIOD_TEXT[0]);
  const [alignColorBG, setAlignColorBG] = useState(initData?.colorbg || COLORBG_TEXT[0]);
  const [alignColorFT, setAlignColorFT] = useState(initData?.colorft || COLORFT_TEXT[0]);
  const [pageBG, setPageBG] = useState(0);
  const [pageFT, setPageFT] = useState(0);

  useEffect(() => {
    setAlignPeriod(() => PERIOD_TEXT[initData?.period] || PERIOD_TEXT[0]);
    setAlignPerpose(() => PERPOSE_TEXT[initData?.perpose] || PERPOSE_TEXT[0]);
    setAlignColorBG(() => COLORBG_TEXT[initData?.colorbg] || COLORBG_TEXT[0]);
    setAlignColorFT(() => COLORFT_TEXT[initData?.colorft] || COLORFT_TEXT[0]);
    setPageBG(Math.floor((initData?.colorbg || 0) / 6));
    setPageFT(Math.floor((initData?.colorft || 0) / 6));
  }, [initData]);

  const handlerAlignPeriod = (event, newAlignPeriod) => {
    setAlignPeriod(newAlignPeriod);
  };
  const handlerAlignPerpose = (event, newAlignPerpose) => {
    setAlignPerpose(newAlignPerpose);
  };
  const handlerAlignColorBG = (event, newAlignColorBG) => {
    setAlignColorBG(newAlignColorBG);
  };
  const handlerAlignColorFT = (event, newAlignColorFT) => {
    setAlignColorFT(newAlignColorFT);
  };
  const handlerNextPageBG = () => {
    if ((pageBG + 1) * 6 < COLORBG_TEXT.length)
      setPageBG((next) => next + 1);
  }
  const handlerPrevPageBG = () => {
    if (pageBG > 0)
      setPageBG((prev) => prev - 1);
  }
  const handlerNextPageFT = () => {
    if ((pageFT + 1) * 6 < COLORFT_TEXT.length)
      setPageFT((next) => next + 1);
  }
  const handlerPrevPageFT = () => {
    if (pageFT > 0)
      setPageFT((prev) => prev - 1);
  }
  const currentColorBG = COLORBG_TEXT.slice(pageBG * 6, (pageBG + 1) * 6);
  const currentColorFT = COLORFT_TEXT.slice(pageFT * 6, (pageFT + 1) * 6);
  const handlerReservedClick = () => {
    const period = PERIOD_TEXT.indexOf(alignPeriod);
    const perpose = PERPOSE_TEXT.indexOf(alignPerpose);
    const colorbg = COLORBG_TEXT.indexOf(alignColorBG);
    const colorft = COLORFT_TEXT.indexOf(alignColorFT);
    if (period === -1 || perpose === -1 || colorbg === -1 || colorft === -1)
      return;
    emit(period, perpose, colorbg, colorft);
    handlerClose();
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
            onChange={handlerAlignPeriod}
            sx={{
              m: 1
            }}
          >
            <Button disabled sx={{ '&.Mui-disabled': { color: 'black' } }}>기간 : </Button>
            {PERIOD_TEXT.map((text, idx) => (
              <ToggleButton value={text} key={idx}>
                {text}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={alignPerpose}
            exclusive
            onChange={handlerAlignPerpose}
            sx={{
              m: 1
            }}
          >
            <Button disabled sx={{ '&.Mui-disabled': { color: 'black' } }}>셀 종류 : </Button>
            {PERPOSE_TEXT.map((text, idx) => (
              <ToggleButton value={text} key={idx}>
                {text}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Box md={2}>
            <ToggleButtonGroup
              value={alignColorBG}
              exclusive
              onChange={handlerAlignColorBG}
              sx={{
                m: 1
              }}
            >
              <ToggleButton value={false} onClick={handlerPrevPageBG} disabled={pageBG === 0}>
                ◀
              </ToggleButton>
              {currentColorBG?.map((text, idx) => (
                < ToggleButton
                  value={text}
                  key={idx}
                  sx={{
                    p: 1,
                    backgroundColor: text.toLowerCase().replace(/_/g, '-'),
                    color: text.toLowerCase().replace(/_/g, '-'),
                    '&.Mui-selected': {
                      backgroundColor: text.toLowerCase().replace(/_/g, '-'),
                      color: ['black'].includes(text.toLowerCase()) ? 'white' : 'black',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: text.toLowerCase().replace(/_/g, '-'),
                      color: ['black'].includes(text.toLowerCase()) ? 'white' : 'black',
                      opacity: 0.8,
                    },
                    '&:hover': {
                      backgroundColor: text.toLowerCase().replace(/_/g, '-'),
                      opacity: 0.8,
                    },
                  }}>
                  bg
                </ToggleButton>
              ))}
              <ToggleButton value={false} onClick={handlerNextPageBG} disabled={(pageBG + 1) * 6 >= COLORBG_TEXT.length}>
                ▶
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box md={2}>
            <ToggleButtonGroup
              value={alignColorFT}
              exclusive
              onChange={handlerAlignColorFT}
              sx={{
                m: 1
              }}
            >
              <ToggleButton value={false} onClick={handlerPrevPageFT} disabled={pageFT === 0}>
                ◀
              </ToggleButton>
              {currentColorFT?.map((text, idx) => (
                <ToggleButton
                  value={text}
                  key={idx}
                  sx={{
                    p: 1,
                    backgroundColor: text.toLowerCase().replace(/_/g, '-'),
                    color: text.toLowerCase().replace(/_/g, '-'),
                    '&.Mui-selected': {
                      backgroundColor: text.toLowerCase().replace(/_/g, '-'),
                      color: ['black'].includes(text.toLowerCase()) ? 'white' : 'black',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: text.toLowerCase().replace(/_/g, '-'),
                      color: ['black'].includes(text.toLowerCase()) ? 'white' : 'black',
                      opacity: 0.8,
                    },
                    '&:hover': {
                      backgroundColor: text.toLowerCase().replace(/_/g, '-'),
                      opacity: 0.8,
                    },
                  }}>
                  fg
                </ToggleButton>
              ))}
              <ToggleButton value={false} onClick={handlerNextPageFT} disabled={(pageFT + 1) * 6 >= COLORFT_TEXT.length}>
                ▶
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
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
    </Modal >
  );
};

export default CellReserved;