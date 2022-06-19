import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1C3041',
    },
    secondary: {
      main: '#18F2B2',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: ['Poppins', 'Roboto', 'sans-serif', '-apple-system'].join(','),
  },
});

export const colorPallete = {
  primary: '#1C3041',
  secondary: '#18F2B2',
  claret: '#89043D',
  blue: '#1473E6',
  black: '#323232',
};

export default theme;
