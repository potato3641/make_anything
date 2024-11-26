import React, { useState, useRef, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Fab from '@mui/material/Fab';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Sheets from '../components/Sheets'
import { icons } from '../const.js'
import './SheetPage.css'
import { DialogContent } from '@mui/material';

const SheetPage = () => {

  const [tabStopper, setTabStopper] = useState(false)
  const savedTabValue = localStorage.getItem('selectedTab');
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [sizeOfSheet, setSizeOfSheet] = useState(10);
  const [displaySize, setDisplaySize] = useState(sizeOfSheet);
  const [confirmSize, setConfirmSize] = useState(null);
  const [inheritData, setInheritData] = useState(false);
  const [inheritSetting, setInheritSetting] = useState(false);
  const tempSize = useRef(sizeOfSheet);
  const toolbarRef = useRef(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const sheetRef = useRef();
  const [snackMsg, setSnackMsg] = useState('Activate Sheet Saved')

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
      const [size, data, setting] = loadData;
      setInheritData(data);
      setInheritSetting(setting);
      setConfirmSize(size);
    } else {
      setInheritData(null);
      setInheritSetting(null);
      setConfirmSize(null);
    }
  }

  const [tabValue, setTabValue] = useState(() => {
    // useEffect에 사용 불가 및 TabValue로 묶을 수 없음
    loadTabData(savedTabValue);
    return 0;
  });

  useEffect(() => {
    // 스크롤용 상단바 길이 계산
    if (toolbarRef.current) {
      const { height } = toolbarRef.current.getBoundingClientRect();
      setToolbarHeight(height + 40);
    }
    // 이전 탭 확인도구
    const savedTabValue = localStorage.getItem('selectedTab');
    if (savedTabValue !== null) {
      const parsedTabValue = Number(savedTabValue);
      setTabValue(parsedTabValue);
    }
  }, []);

  const handlerSnackbar = (onoff, msg = 'Activate Sheet Saved') => { setOpenSnack(onoff); setSnackMsg(msg); }
  const handleDialogClick = () => setOpenDialog(true);
  const handleSnackClose = () => setOpenSnack(false);
  const handleDialogClose = () => setOpenDialog(false);
  const handlerDialogConfirm = () => {
    // console.log('confirmed from dialog')
    // console.log(inheritData)
    setInheritData(false);
    setInheritSetting(false);
    setConfirmSize(sizeOfSheet);
    setOpenDialog(false);
  }
  const handleSnackClick = () => {
    saveDataToLocalStorage(tabValue, sizeOfSheet, getSheetData(), getSheetSetting());
    handlerSnackbar(true);
  }

  const loadingStopper = () => {
    setTabStopper(false);
  }

  /**
   * 로컬에 데이터저장하기
   */
  const saveDataToLocalStorage = (num, size, dataFromSheet, settingFromSheet) => {
    const data = [size, dataFromSheet, settingFromSheet];
    localStorage.setItem(`sheetData${num}`, JSON.stringify(data));
    // console.log(`sheet ${num} saved`);
    // console.log(data);
  }

  /**
   * 현재 활성화된 시트에서 데이터 갖고오기
   */
  const getSheetData = () => {
    if (sheetRef.current) {
      return sheetRef.current.getCellValues();
    }
    return {};
  }

  /**
   * 현재 활성화된 시트에서 세팅 갖고오기
   */
  const getSheetSetting = () => {
    if (sheetRef.current) {
      return sheetRef.current.getCellSettings();
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
    setTabStopper(true);
    if (confirmSize) {
      saveDataToLocalStorage(tabValue, confirmSize, getSheetData(), getSheetSetting());
      sheetRef.current.delPrevValues();
      sheetRef.current.delPrevSettings();
    }
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
              <Tab
                key={index}
                icon={icon}
                label={`File ${index + 1}`}
                disabled={tabStopper}
                sx={{
                  '&.Mui-disabled': {
                    opacity: 1,
                    color: 'white'
                  }
                }}
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Dialog sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        textAlign: 'center',
        overflow: 'hidden',
      }}
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth={false}
      >
        <DialogTitle>size of sheet</DialogTitle>

        <DialogContent sx={{ p: 1, overflow: 'hidden' }}>
          <Typography gutterBottom variant='h4'>{displaySize} x {displaySize}</Typography>
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
        </DialogContent>
        <Button autoFocus onClick={handlerDialogConfirm}>confirm</Button>
      </Dialog>
      <Snackbar
        open={openSnack}
        message={snackMsg}
        autoHideDuration={2000}
        onClose={handleSnackClose}
      />
      <Sheets
        ref={sheetRef}
        size={confirmSize}
        toolbarHeight={toolbarHeight}
        loader={loadingStopper}
        inheritData={inheritData}
        inheritSetting={inheritSetting}
        snackController={handlerSnackbar}
      />
    </div>
  );
};
export default SheetPage;