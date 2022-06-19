import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1473E6',
    },
    secondary: {
      main: '#18F2B2',
    },
    error: {
      main: red.A400,
    },
    success: {
      main: '#18F2B2',
      contrastText: 'white',
    },
  },
  typography: {
    fontFamily: ['Poppins', 'Roboto', 'sans-serif', '-apple-system'].join(','),
  },
});

export default theme;
