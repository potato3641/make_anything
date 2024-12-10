import React from "react";
import { Box } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const SheetBorder = ({ onLeftClick, onRightClick, toolbarHeight }) => {
  return <div className='sheet-border'>
    <Box // top
      sx={{
        position: "absolute",
        top: `${toolbarHeight - 40}px`,
        left: 0,
        right: 0,
        height: "20px",
        backgroundColor: '#eaeaea',
        zIndex: 10,
      }}
    />
    <Box // bottom
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "20px",
        backgroundColor: '#eaeaea',
        zIndex: 10,
      }}
    />
    <Box // left
      sx={{
        position: "absolute",
        top: `${toolbarHeight - 20}px`,
        bottom: "20px",
        left: 0,
        width: "20px",
        backgroundColor: '#eaeaea',
        color: '#eaeaea',
        zIndex: 10,
        '&:hover': {
          backgroundColor: '#ccc',
          color: 'black',
        },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
      }}
      onClick={onLeftClick}
    ><ArrowBack /></Box>
    <Box // right
      sx={{
        position: "absolute",
        top: `${toolbarHeight - 20}px`,
        bottom: "20px",
        right: 0,
        width: "20px",
        backgroundColor: '#eaeaea',
        color: '#eaeaea',
        zIndex: 10,
        '&:hover': {
          backgroundColor: '#ccc',
          color: 'black',
        },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
      }}
      onClick={onRightClick}
    ><ArrowForward /></Box>
  </div>
}
export default SheetBorder;