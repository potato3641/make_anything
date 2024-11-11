import React from 'react';
import { Modal, Box, Fade, Backdrop } from '@mui/material';
import './CellReserved.css';

const CellReserved = ({ openModal, handlerClose }) => {
  return (
    <Modal
      open={openModal}
      onClose={handlerClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          TransitionComponent: Fade,
        },
      }}
    >

      <Fade in={openModal}>
        <Box className="modal-box">
          <p>I need function of reservation</p>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CellReserved;