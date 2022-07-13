import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  MenuItem,
  Grid,
  Box,
  styled,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import { useState, useEffect, Fragment } from 'react';
import { iconFromRoute, routes, VisitorType } from '../../utils/routes';
import Link from './Link';
import Image from 'next/image';

import Logo from '../../assets/logo.png';
import { colorPallete } from '../theme';
import { IronSessionData } from 'iron-session';
import { Container } from '@mui/system';

interface HeaderProps {
  user: Partial<IronSessionData['user']>;
}

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const MenuButtonLink = styled(Link)(() => ({
  margin: '0 10px',
  fontWeight: 700,
  paddingTop: 4,
  paddingBottom: 4,
  paddingLeft: 7.5,
  paddingRight: 7.5,
  textDecoration: 'none',
}));

const ActiveMenuButtonLink = styled(MenuButtonLink)(({ theme }) => ({
  color: theme.palette.secondary.main,
}));

const NotActiveMenuButtonLink = styled(MenuButtonLink)(({ theme }) => ({
  '&:hover': {
    color: colorPallete.claret,
  },
  borderRadius: '20px',
  transition: '0.5s',
  color: '#FFF',
}));

export default function Header({ user }: HeaderProps) {
  const userType = user?.type ?? 'guest';

  console.log(user);

  const contextRoutes: typeof routes = Object.fromEntries(
    Object.entries(routes).filter(
      ([, { validUserTypes, type }]) =>
        type !== 'invisible' &&
        (validUserTypes === 'all' ||
          validUserTypes.includes(userType as VisitorType))
    )
  );

  const router = useRouter();

  const [mobileView, setMobileView] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 700
        ? setMobileView(true)
        : setMobileView(false);
    };

    setResponsiveness();

    window.addEventListener('resize', () => setResponsiveness());
  }, []);

  const displayDesktop = () => {
    const handleDrawerOpen = () => setDrawerOpen(true);
    const handleDrawerClose = () => setDrawerOpen(false);

    return (
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Drawer
          {...{
            anchor: 'right',
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <Box sx={{ padding: '20px 10px' }}>{getDrawerChoices()}</Box>
        </Drawer>
        {getLogo}
        <Grid container direction="row">
          {getMenuButtons()}
        </Grid>
        {getIconChoices()}
        <IconButton
          {...{
            edge: 'start',
            color: 'inherit',
            'aria-label': 'menu',
            'aria-haspopup': 'true',
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () => setDrawerOpen(true);
    const handleDrawerClose = () => setDrawerOpen(false);

    return (
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Drawer
          {...{
            anchor: 'right',
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <Box sx={{ padding: '20px 10px' }}>{getDrawerChoices()}</Box>
        </Drawer>

        <div>{getLogo}</div>

        <Grid item>
          {getIconChoices()}

          <IconButton
            {...{
              edge: 'start',
              color: 'inherit',
              'aria-label': 'menu',
              'aria-haspopup': 'true',
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Grid>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return (
      <>
        {user?.name ? (
          <>
            <MenuItem>
              <Typography
                sx={{
                  fontSize: '1.2rem',
                }}
              >
                Olá, {user.name}
              </Typography>
            </MenuItem>
            <Divider />
          </>
        ) : (
          <></>
        )}
        {Object.keys(contextRoutes)
          .filter((href) => {
            const route = contextRoutes[href];
            return (
              route.type === 'secondary' ||
              (mobileView && route.type === 'primary')
            );
          })
          .map((href) => {
            const { label, fn } = contextRoutes[href];
            const menuItem = (
              <MenuItem
                key={label}
                sx={{ margin: '10px 0' }}
                onClick={
                  fn
                    ? async () => {
                        await fn();
                        setDrawerOpen(false);
                      }
                    : undefined
                }
              >
                {iconFromRoute(href)}
                <Typography
                  sx={{
                    marginLeft: '15px',
                    transition: '0.25s',
                    color: router.route === href ? '#F24302' : 'inherit',
                  }}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
            return fn ? (
              menuItem
            ) : (
              <Link
                sx={{
                  textDecoration: 'none',
                }}
                key={label}
                onClick={() => {
                  setDrawerOpen(false);
                }}
                href={href}
              >
                {menuItem}
              </Link>
            );
          })}
      </>
    );
  };

  const getIconChoices = () => {
    return Object.keys(contextRoutes)
      .filter((href) => {
        const route = contextRoutes[href];
        return route.type === 'icon';
      })
      .map((href) => {
        return (
          <Link key={href} href={href} m="0 15px">
            <IconButton
              {...{
                edge: 'start',
                color: 'secondary',
                'aria-label': 'menu',
                'aria-haspopup': 'true',
              }}
            >
              {iconFromRoute(href)}
            </IconButton>
          </Link>
        );
      });
  };

  const getLogo = (
    <Link href="/home">
      <div
        style={{
          padding: '5px 5px 0px 5px',
          marginRight: 25,
          fontWeight: 600,
          textAlign: 'left',
        }}
      >
        <Image
          width={150}
          height={Logo.height / (Logo.width / 150)}
          placeholder="blur"
          alt="Tik.me"
          src={Logo}
        />
      </div>
    </Link>
  );

  const getMenuButtons = () => {
    return Object.keys(contextRoutes)
      .filter((href) => {
        const route = contextRoutes[href];
        return route.type === 'primary';
      })
      .map((href) => {
        const { label } = contextRoutes[href];
        return router.route === href ? (
          <ActiveMenuButtonLink href={href} key={label}>
            {label}
          </ActiveMenuButtonLink>
        ) : (
          <NotActiveMenuButtonLink href={href} key={label}>
            {label}
          </NotActiveMenuButtonLink>
        );
      });
  };

  return (
    <header>
      <Fragment>
        <AppBar
          sx={{
            paddingRight: '20px',
            paddingLeft: '20px',
            '@media (max-width: 700px)': {
              paddingLeft: 0,
            },
            boxShadow: 'none',
          }}
          position="fixed"
        >
          {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
        <Offset id="back-to-top-anchor" />
      </Fragment>
    </header>
  );
}
