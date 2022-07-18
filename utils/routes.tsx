import { ReactElement } from 'react';
import Router from 'next/router';
import {
  Home,
  ShoppingCartOutlined,
  LoginOutlined,
  ConfirmationNumberOutlined,
  HomeOutlined,
  SearchOutlined,
  LogoutOutlined,
  PersonAddOutlined,
  AccountCircleOutlined,
  AddBoxOutlined,
  AdminPanelSettingsOutlined,
} from '@mui/icons-material';
import axios from 'axios';
import { UserType } from '../src/database/models/User';

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
    label: 'Cadastrar',
    type: 'secondary',
    icon: <PersonAddOutlined />,
    validUserTypes: ['guest'],
  },
  '/home': {
    label: 'Home',
    type: 'secondary',
    icon: <HomeOutlined />,
    validUserTypes: 'all',
  },
  '/user': {
    label: 'Meu Perfil',
    type: 'secondary',
    icon: <AccountCircleOutlined />,
    validUserTypes: ['user', 'admin'],
  },
  '/explore': {
    label: 'Explorar Eventos',
    type: 'primary',
    icon: <SearchOutlined />,
    validUserTypes: 'all',
  },
  '/my-tickets': {
    label: 'Meus Tickets',
    type: 'secondary',
    icon: <ConfirmationNumberOutlined />,
    validUserTypes: ['user', 'admin'],
  },
  '/admin': {
    label: 'Painel de Administração',
    icon: <AdminPanelSettingsOutlined />,
    type: 'secondary',
    validUserTypes: ['admin'],
  },
  '/admin/create-event': {
    label: 'Criar Evento',
    icon: <AddBoxOutlined />,
    type: 'primary',
    validUserTypes: ['admin'],
  },
  '/admin/create-user': {
    label: 'Criar Usuário',
    icon: <PersonAddOutlined />,
    type: 'secondary',
    validUserTypes: ['admin'],
  },
  '/logout': {
    // In production a loading animation should be shown while logging out
    label: 'Logout',
    type: 'secondary',
    icon: <LogoutOutlined />,
    validUserTypes: ['user', 'admin'],
    fn: async () => {
      await axios.post('/api/user/logout');
      Router.push('/login');
    },
  },
  '/cart': {
    label: 'Carrinho',
    type: 'icon',
    icon: <ShoppingCartOutlined />,
    validUserTypes: ['user', 'admin'],
  },
  '/admin/manage-events': {
    label: 'Gerenciar Eventos',
    type: 'invisible',
    validUserTypes: ['admin'],
  },
  '/admin/manage-users': {
    label: 'Gerenciar Usuários',
    type: 'invisible',
    validUserTypes: ['admin'],
  },
  '/': {
    label: 'Home',
    type: 'invisible',
    validUserTypes: 'all',
  },
  '/event': {
    label: 'Event',
    type: 'invisible',
    validUserTypes: 'all',
    matchRegex: /\/event\/[\[\]a-zA-Z0-9]+/,
  },
  '/ticket': {
    label: 'Ticket',
    type: 'invisible',
    validUserTypes: ['admin', 'user'],
    matchRegex: /\/ticket\/[\[\]a-zA-Z0-9]+/,
  },
  '/checkout': {
    label: 'Checkout',
    type: 'invisible',
    validUserTypes: ['user', 'admin'],
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
    return '/';
  }
  if (validUserTypes.includes('admin')) {
    if (validUserTypes.includes('user')) {
      return '/login' + (bounceBack ? `?bounce=${route}` : '');
    }
    return '/';
  }
  if (validUserTypes.includes('user')) {
    return '/login' + (bounceBack ? `?bounce=${route}` : '');
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
