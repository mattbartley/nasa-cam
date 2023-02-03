import { createTheme } from '@mui/material/styles';

const DarkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#519591',
    },
    secondary: {
      main: '#334756',
    },
    focus: {
      main: '#519591',
    },
    info: {
      main: '#dd7e7e',
    },
    background: {
      paper: '#101824',
      default: '#101824',
    },
    action: {
      active: '#334756',
      hover: '#5195914f',
      hoverOpacity: '0.2',
      selected: '#db6d35',
      selectedOpacity: '.16',
      disabled: 'rgb(82 82 82)',
      disabledBackground: 'rgb(63 63 63 / 63%)',
      focus: '#db6d35',
      focusOpacity: '0',
    },
  },
  typography: {
    fontFamily: [
      'Jura',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
    ].join(','),
  },
});

export default DarkTheme;
