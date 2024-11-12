import React, { useState } from 'react';
import './CheckField.css';
import { ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const CheckField = ({ onBlur, onFocus, inputRef }) => {
  const [selected, setSelected] = useState(false);
  return (
    <ToggleButton
      color="info"
      value={selected}
      selected={selected}
      onChange={() => setSelected((val) => !val)}
      onBlur={onBlur}
      onFoucs={onFocus}
      inputRef={inputRef}
    >
      <CheckIcon />
    </ToggleButton>
  );
};

export default CheckField;