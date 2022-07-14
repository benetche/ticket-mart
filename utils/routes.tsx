import { ReactElement } from 'react';
import Router from 'next/router';
import {
  Home,
  ShoppingCartOutlined,
  LoginOutlined,
  HelpCenterOutlined,
  ConfirmationNumberOutlined,
  HomeOutlined,
  SearchOutlined,
  PublishOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import axios from 'axios';
import { UserType } from '../src/database/models/User';
import { VariableExpressionOperator } from 'mongoose';

export type VisitorType = UserType | 'guest';

export interface TRoute {
  label: string;
  type: 'primary' | 'icon' | 'secondary' | 'invisible';
  icon?: ReactElement;
  validUserTypes: VisitorType[] | 'all';
  matchRegex?: RegExp;
  fn?: () => void | Promise<void>;
}

export const routes: Record<string, TRoute> = {
  '/login': {
    label: 'Login',
    type: 'secondary',
    icon: <LoginOutlined />,
    validUserTypes: ['guest'],
  },
  '/register': {
    label: 'Register',
    type: 'secondary',

    validUserTypes: ['guest'],
  },
  '/home': {
    label: 'Home',
    type: 'secondary',
    icon: <HomeOutlined />,
    validUserTypes: ['user', 'admin'],
  },
  '/user': {
    label: 'Meu Perfil',
    type: 'secondary',
    validUserTypes: ['user', 'admin'],
  },
  '/explore': {
    label: 'Explorar Eventos',
    type: 'primary',
    icon: <SearchOutlined />,
    validUserTypes: ['user', 'admin'],
  },
  '/publish': {
    label: 'Publicar Evento',
    type: 'primary',
    icon: <PublishOutlined />,
    validUserTypes: ['user', 'admin'],
  },
  '/my-tickets': {
    label: 'Meus Tickets',
    type: 'secondary',
    icon: <ConfirmationNumberOutlined />,
    validUserTypes: ['user', 'admin'],
  },
  '/help': {
    label: 'Ajuda',
    type: 'secondary',
    icon: <HelpCenterOutlined />,
    validUserTypes: 'all',
  },
  '/logout': {
    label: 'Logout',
    type: 'secondary',
    icon: <LogoutOutlined />,
    validUserTypes: ['user', 'admin'],
    fn: async () => {
      await axios.post('/api/user/logout');
      Router.push('/');
    },
  },
  '/cart': {
    label: 'Carrinho',
    type: 'icon',
    icon: <ShoppingCartOutlined />,
    validUserTypes: ['user', 'admin'],
  },
  '/': {
    label: 'Login',
    type: 'invisible',
    validUserTypes: ['guest'],
  },
  '/event': {
    label: 'Event',
    type: 'invisible',
    validUserTypes: ['admin', 'user'],
    matchRegex: /\/event\/[\[\]a-zA-Z0-9]+/,
  },
};

export const titleFromRoute = (baseTitle: string, route: string): string => {
  const currRoute = getCurrentRoute(route);
  if (currRoute) {
    return `${baseTitle} | ${currRoute.label}`;
  }
  return baseTitle;
};

export const iconFromRoute = (route: string): ReactElement => {
  const currRoute = getCurrentRoute(route);
  if (currRoute?.icon) {
    return currRoute.icon;
  }
  return <Home />;
};

export const redirectToFrom = (route: string, bounceBack = false): string => {
  const currRoute = getCurrentRoute(route);
  if (currRoute === undefined) {
    return route;
  }
  const { validUserTypes } = currRoute;
  if (validUserTypes === 'all') {
    return route;
  }
  if (validUserTypes.includes('guest')) {
    return '/home';
  }
  if (validUserTypes.includes('admin')) {
    if (validUserTypes.includes('user')) {
      return '/' + (bounceBack ? `?bounce=${route}` : '');
    }
    return '/home';
  }
  if (validUserTypes.includes('user')) {
    return '/' + (bounceBack ? `?bounce=${route}` : '');
  }
  return route;
};

export const getCurrentRoute = (
  url: string,
  contextRoutes = routes
): TRoute | undefined => {
  const route = contextRoutes[url];
  if (route !== undefined) {
    return route;
  }
  const match = Object.keys(contextRoutes).find((key: string) => {
    const currRoute = contextRoutes[key];
    if (currRoute.matchRegex) {
      return currRoute.matchRegex.test(url);
    }
    return false;
  });
  if (match) {
    return contextRoutes[match];
  }
  console.warn(`Using non defined route: ${url}`);
};
