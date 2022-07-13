import { Box, Grid } from '@mui/material';
import Footer from './Footer';
import Header from './Header';
import { ReactElement } from 'react';
import { IronSessionData } from 'iron-session';

interface LayoutProps {
  children: ReactElement;
  user: Partial<IronSessionData['user']>;
}

export default function Layout({ children, user }: LayoutProps) {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header user={user} />
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
