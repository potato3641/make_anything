import React, { useState } from 'react';
import './Examples.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Snackbar from '@mui/material/Snackbar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/material/Pagination';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import Skeleton from '@mui/material/Skeleton';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const Examples = () => {

  const steps = ['Step 1', 'Step 2', 'Step 3'];
  const [age, setAge] = React.useState('');
  const [value, setValue] = React.useState(0);
  const [openSnack, setOpenSnack] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [checked, setChecked] = React.useState(false);

  const handleSwitchChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handlePopoverClick = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);
  const handlePopoverClick2 = (event) => setAnchorEl2(event.currentTarget);
  const handlePopoverClose2 = () => setAnchorEl2(null);
  const handleDialogClick = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);
  const handleSnackClick = () => setOpenSnack(true);
  const handleSnackClose = () => setOpenSnack(false);

  return (
    <div>
      <div className='ex'> {/*팝오버 심화 예제*/}
        <div>
          <Button aria-describedby="simple-popover" onClick={handlePopoverClick2}>
            Open Popover
          </Button>
          <Popover
            id="simple-popover"
            open={Boolean(anchorEl2)}
            anchorEl={anchorEl2}
            onClose={handlePopoverClose2}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <Typography sx={{ p: 2 }}>Popover content here</Typography>
          </Popover>
        </div>
      </div>
      <div className='ex'> {/*카드같지만 그냥 감싸는 용도 예제*/}
        <Paper elevation={3} style={{ padding: 16 }}>
          <Typography variant="h5">Paper Component</Typography>
          <Typography>This is some text inside a Paper component.</Typography>
        </Paper>
      </div>
      <div className='ex'> {/*반응형 그리드 예제*/}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper style={{ padding: 16 }}>Left Side</Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper style={{ padding: 16 }}>Right Side</Paper>
          </Grid>
        </Grid>
      </div>
      <div className='ex'> {/*단계별 진행도 컴포넌트 예제*/}
        <Stepper activeStep={1}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className='ex'> {/*토글 버튼 예제*/}
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleSwitchChange} />}
          label="Switch"
        />
      </div>
      <div className='ex'> {/*마우스올리면설명나오게하는버튼 예제*/}
        <Tooltip title="설명">
          <Button>Delete</Button>
        </Tooltip>
      </div>
      <div className='ex'> {/*탭 예제*/}
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Tab 1" />
          <Tab label="Tab 2" />
          <Tab label="Tab 3" />
        </Tabs>
      </div>
      <div className='ex'> {/*표 예제*/}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
              <TableCell>25</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane</TableCell>
              <TableCell>30</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className='ex'> {/*심화 플로팅아이콘 예제*/}
        <SpeedDial ariaLabel="SpeedDial example" icon={<SpeedDialIcon />} />
      </div>
      <div className='ex'> {/*로딩다되기전에보여줄 틀 예제*/}
        <Skeleton variant="rectangular" width={210} height={118} />
      </div>
      <div className='ex'> {/*슬라이더 예제*/}
        <Slider defaultValue={30} aria-label="Default" valueLabelDisplay="auto" />
      </div>
      <div className='ex'> {/*누르면근처에서튀어나오는모달창 예제*/}
        <div>
          <Button onClick={handlePopoverClick}>Open Popover</Button>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
          >
            <Typography sx={{ p: 2 }}>Popover content here</Typography>
          </Popover>
        </div>
      </div>
      <div className='ex'> {/*페이지네이션 예제*/}
        <Pagination count={10} color="primary" />
      </div>
      <div className='ex'> {/*리스트 예제*/}
        <List>
          <ListItem>
            <ListItemText primary="Item 1" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Item 2" />
          </ListItem>
        </List>
      </div>
      <div className='ex'> {/*선형 프로그레스바 예제*/}
        <LinearProgress />
      </div>
      <div className='ex'> {/*인풋박스드롭다운 예제*/}
        <FormControl fullWidth>
          <InputLabel>Age</InputLabel>
          <Select value={age} onChange={(e) => setAge(e.target.value)}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className='ex'> {/*플로팅 아이콘 예제*/}
        <Fab color="primary" aria-label="add"><AddIcon /></Fab>
      </div>
      <div className='ex'> {/*구분선 예제*/}
        <Typography>Section 1</Typography>
        <Divider />
        <Typography>Section 2</Typography>
      </div>
      <div className='ex'> {/*레이아웃용 고정너비 컨테이너 예제*/}
        <Container maxWidth="sm">
          <Typography variant="h4">Container Component</Typography>
          <Typography variant="body1">This is some content inside a container.</Typography>
        </Container>
      </div>
      <div className='ex'> {/*원형 프로그레스바 예제*/}
        <CircularProgress />
      </div>
      <div className='ex'> {/*그냥 alert띄우는 예제*/}
        <Chip label="Clickable Chip" onClick={() => alert('Chip clicked!')} />
      </div>
      <div className='ex'> {/*링크바로가기 예제 없어도될듯?*/}
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/">Home</Link>
          <Link href="/category">Category</Link>
          <Typography color="textPrimary">Current Page</Typography>
        </Breadcrumbs>
      </div>
      <div className='ex'> {/*하단용네비게이션 예제*/}
        <BottomNavigation value={value} onChange={(event, newValue) => setValue(newValue)}>
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </div>
      <div className='ex'> {/*메일뱃지 예제*/}
        <Badge badgeContent={4} color="primary"><MailIcon /></Badge>
      </div>
      <div className='ex'> {/*사용자프로필아이콘 예제*/}
        <Avatar alt="User Name" src="/profile.jpg" />
      </div>
      <div className='ex'> {/*경고창 예제*/}
        <Alert severity="error">This is an error alert!</Alert>
      </div>
      <div className='ex'> {/*확장형상하단바 예제*/}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Accordion Title</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>This is the accordion content.</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className='ex'> {/*그리드 레이아웃 예제*/}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper style={{ padding: '16px' }}>Left</Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper style={{ padding: '16px' }}>Right</Paper>
          </Grid>
        </Grid>
      </div>
      <div className='ex'> {/*다이얼로그(확인모달박스) 예제*/}
        <Button variant="outlined" onClick={handleDialogClick}>
          Open Dialog
        </Button>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogClose}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className='ex'> {/*스낵바(모달알림) 예제*/}
        <Button onClick={handleSnackClick}>Show Snackbar</Button>
        <Snackbar
          open={openSnack}
          message="This is a Snackbar"
          autoHideDuration={3000}
          onClose={handleSnackClose}
        />
      </div>
      <div className='ex'> {/*라디오버튼 예제*/}
        <RadioGroup defaultValue="option1">
          <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
          <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
        </RadioGroup>
      </div>
      <div className='ex'> {/*체크박스 예제*/}
        <FormControlLabel control={<Checkbox />} label="Accept Terms" />
      </div>
      <div className='ex'> {/*사이드바 예제*/}
        <Drawer anchor="left" open={false}>
          <List>
            <ListItem button>Item 1</ListItem>
            <ListItem button>Item 2</ListItem>
          </List>
        </Drawer>
      </div>
      <div className='ex'> {/*상하단바 예제*/}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">My App</Typography>
          </Toolbar>
        </AppBar>
      </div>
      <div className='ex bg-btn'> {/*버튼 예제*/}
        <Button className='btn' variant="contained">Click Me</Button>
      </div>
      <div className='ex'> {/*인풋박스 예제*/}
        <TextField label="" variant="outlined" multiline fullWidth />
      </div>
      <div className='ex'> {/*섹션카드 예제*/}
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Material-UI Card
            </Typography>
            <Typography variant="body2">
              This is a simple card component using Material-UI.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Examples;