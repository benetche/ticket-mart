import { ReactElement } from 'react';
import {
  Home,
  ShoppingCartOutlined,
  LoginOutlined,
  HelpCenterOutlined,
  ConfirmationNumberOutlined,
  HomeOutlined,
  SearchOutlined,
  PublishOutlined,
} from '@mui/icons-material';

export interface TRoute {
  label: string;
  type: 'primary' | 'icon' | 'secondary';
  icon?: ReactElement;
}

export const routes: Record<string, TRoute> = {
  '/home': {
    label: 'Home',
    type: 'secondary',
    icon: <HomeOutlined />,
  },
  '/explore': {
    label: 'Explorar Eventos',
    type: 'primary',
    icon: <SearchOutlined />,
  },
  '/publish': {
    label: 'Publicar Evento',
    type: 'primary',
    icon: <PublishOutlined />,
  },
  '/cart': {
    label: 'Carrinho',
    type: 'icon',
    icon: <ShoppingCartOutlined />,
  },
  '/login': {
    label: 'Login',
    type: 'secondary',
    icon: <LoginOutlined />,
  },
  '/help': {
    label: 'Ajuda',
    type: 'secondary',
    icon: <HelpCenterOutlined />,
  },
  '/my-tickets': {
    label: 'Meus Tickets',
    type: 'secondary',
    icon: <ConfirmationNumberOutlined />,
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
