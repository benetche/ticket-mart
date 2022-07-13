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
    label: 'Index',
    type: 'invisible',
    validUserTypes: ['guest'],
  },
};

export const titleFromRoute = (baseTitle: string, route: string): string => {
  const currRoute = routes[route];
  if (currRoute) {
    return `${baseTitle} | ${currRoute.label}`;
  }
  return baseTitle;
};

export const iconFromRoute = (route: string): ReactElement => {
  const currRoute = routes[route];
  if (currRoute.icon) {
    return currRoute.icon;
  }
  return <Home />;
};

export const redirectToFrom = (route: string): string => {
  const currRoute = routes[route];
  if (currRoute === undefined) {
    console.warn(`Using non defined route: ${route}`);
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
      return '/';
    }
    return '/home';
  }
  if (validUserTypes.includes('user')) {
    return '/';
  }
  return route;
};
