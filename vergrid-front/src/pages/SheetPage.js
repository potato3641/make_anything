import React from 'react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Sheets from '../components/Sheets'

const SheetPage = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Top Nav bar (None)</Typography>
        </Toolbar>
      </AppBar>
      <Sheets size={15} />
    </div>
  );
};
export default SheetPage;