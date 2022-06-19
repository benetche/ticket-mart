import { Box, Grid } from '@mui/material';
import Footer from './Footer';
import Header from './Header';
import { ReactElement } from 'react';

interface LayoutProps {
  children: ReactElement;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />
      <Grid
        direction="column"
        container
        justifyContent="center"
        alignContent="center"
        style={{ flex: 1 }}
      >
        {children}
      </Grid>
      <Footer />
    </Box>
  );
}
