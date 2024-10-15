import React, { useState, useRef, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Fab from '@mui/material/Fab';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Filter1RoundedIcon from '@mui/icons-material/Filter1Rounded';
import Filter2RoundedIcon from '@mui/icons-material/Filter2Rounded';
import Filter3RoundedIcon from '@mui/icons-material/Filter3Rounded';
import Filter4RoundedIcon from '@mui/icons-material/Filter4Rounded';
import Filter5RoundedIcon from '@mui/icons-material/Filter5Rounded';
import Filter6RoundedIcon from '@mui/icons-material/Filter6Rounded';
import Filter7RoundedIcon from '@mui/icons-material/Filter7Rounded';
import Filter8RoundedIcon from '@mui/icons-material/Filter8Rounded';
import Filter9RoundedIcon from '@mui/icons-material/Filter9Rounded';
import Sheets from '../components/Sheets'

const icons = [
  <Filter1RoundedIcon />,
  <Filter2RoundedIcon />,
  <Filter3RoundedIcon />,
  <Filter4RoundedIcon />,
  <Filter5RoundedIcon />,
  <Filter6RoundedIcon />,
  <Filter7RoundedIcon />,
  <Filter8RoundedIcon />,
  <Filter9RoundedIcon />,
]

const SheetPage = () => {

  const savedTabValue = localStorage.getItem('selectedTab');
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [sizeOfSheet, setSizeOfSheet] = useState(10);
  const [displaySize, setDisplaySize] = useState(sizeOfSheet);
  const [confirmSize, setConfirmSize] = useState(null);
  const [inheritData, setInheritData] = useState(false);
  const tempSize = useRef(sizeOfSheet);
  const toolbarRef = useRef(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const sheetRef = useRef();

  const loadDataFromLocalStorage = (num) => {
    const savedData = localStorage.getItem(`sheetData${num}`);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [null, null];
  };

  const loadTabData = (num) => {
    const loadData = loadDataFromLocalStorage(num);
    if (loadData && loadData[1]) {
      const [size, data] = loadData;
      setInheritData(data);
      setConfirmSize(size);
    } else {
      setInheritData(null);
      setConfirmSize(null);
    }
  }

  const [tabValue, setTabValue] = useState(() => {
    loadTabData(savedTabValue);
    return 0;
  });

  useEffect(() => {
    // 스크롤용 상단바 길이 계산
    if (toolbarRef.current) {
      const { height } = toolbarRef.current.getBoundingClientRect();
      setToolbarHeight(height);
    }
    // 이전 탭 확인도구
    const savedTabValue = localStorage.getItem('selectedTab');
    if (savedTabValue !== null) {
      const parsedTabValue = Number(savedTabValue);
      setTabValue(parsedTabValue);
    }
  }, []);

  const handleDialogClick = () => setOpenDialog(true);
  const handleSnackClose = () => setOpenSnack(false);
  const handleDialogClose = () => setOpenDialog(false);
  const handlerDialogConfirm = () => {
    // console.log('confirmed from dialog')
    // console.log(inheritData)
    setInheritData(false);
    setConfirmSize(sizeOfSheet);
    setOpenDialog(false);
  }
  const handleSnackClick = () => {
    saveDataToLocalStorage(tabValue, sizeOfSheet, getSheetData());
    setOpenSnack(true);
  }

  // 로컬에 데이터저장하기
  const saveDataToLocalStorage = (num, size, dataFromSheet) => {
    const data = [size, dataFromSheet];
    localStorage.setItem(`sheetData${num}`, JSON.stringify(data));
    // console.log(`sheet ${num} saved`);
    // console.log(data);
  }

  // 시트에서 데이터 갖고오기
  const getSheetData = () => {
    if (sheetRef.current) {
      return sheetRef.current.getCellValues();
    }
    return {};
  }

  // Slider
  const handleSliderChange = (event, value) => {
    tempSize.current = value;
    requestAnimationFrame(() => setDisplaySize(tempSize.current));
  };
  const handleSliderChangeCommitted = (event, value) => {
    setSizeOfSheet(value);
  };

  // Tab
  const handleTabChange = (event, newValue) => {
    if (confirmSize)
      saveDataToLocalStorage(tabValue, confirmSize, getSheetData());
    setTabValue(newValue);
    localStorage.setItem('selectedTab', newValue);
    loadTabData(newValue);
  };

  return (
    <div className='sheet-page'>
      <AppBar position="static">
        <Toolbar ref={toolbarRef} role="navigation">
          <Fab sx={{ margin: '10px' }} onClick={handleDialogClick} color="primary" aria-label="add"><AddIcon /></Fab>
          <Fab sx={{ margin: '10px' }} onClick={handleSnackClick} color="primary" aria-label="save"><SaveIcon /></Fab>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'white',
              },
              '& .Mui-selected': {
                color: 'black !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'black',
              },
            }}>
            {icons.map((icon, index) => (
              <Tab key={index} icon={icon} label={`File ${index + 1}`} />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth={false}>
        <DialogTitle>size of sheet</DialogTitle>
        <DialogActions
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            textAlign: 'center',
            overflow: 'hidden',
          }}>
          <Typography variant='h4'>{displaySize} x {displaySize}</Typography>
          <Slider
            value={tempSize.current}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderChangeCommitted}
            min={3}
            max={25}
            sx={{
              width: '90%',
            }}
            aria-label="Default" />
          <Button onClick={handlerDialogConfirm}>confirm</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnack}
        message="Activate Sheet Saved"
        autoHideDuration={2000}
        onClose={handleSnackClose}
      />
      <Sheets
        ref={sheetRef}
        size={confirmSize}
        toolbarHeight={toolbarHeight}
        saveData={saveDataToLocalStorage}
        inheritData={inheritData} />
    </div>
  );
};
export default SheetPage;