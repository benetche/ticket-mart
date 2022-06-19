import Typography from '@mui/material/Typography';
import { KeyboardArrowUp, Favorite } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import MuiLink from '@mui/material/Link';
import { Box, Fab, Grid, styled, useScrollTrigger, Zoom } from '@mui/material';

interface ScrollTopProps {
  children: React.ReactElement;
}

interface FooterProps {
  style?: React.CSSProperties;
}

function ScrollTop({ children }: ScrollTopProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        sx={{
          position: 'fixed',
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
        onClick={handleClick}
        role="presentation"
      >
        {children}
      </Box>
    </Zoom>
  );
}

const FooterItem = styled(Typography)(() => ({
  paddingTop: 5,
}));

export default function Footer({ style }: FooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        padding: '10px 20px',
        backgroundColor: '#fff',
        borderTop: '1px solid #e0e0e0',
      }}
      style={{ ...style }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={12} sm={4}>
          <FooterItem variant="body2" color="textSecondary" align="center">
            {`Copyright © ${new Date().getFullYear()} | `}
            Tik.me
            {'.'}
          </FooterItem>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FooterItem variant="body2" color="textSecondary" align="center">
            Feito com <Favorite sx={{ fontSize: 12, color: red[500] }} /> por{' '}
            <MuiLink
              target="_blank"
              rel="noopener"
              color="inherit"
              href="https://google.com"
            >
              ???
            </MuiLink>
          </FooterItem>
        </Grid>
      </Grid>
      <ScrollTop>
        <Fab color="secondary" size="small" aria-label="Voltar ao top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </Box>
  );
}
