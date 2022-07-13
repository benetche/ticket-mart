import type { NextPage } from 'next';
import { withUserGuard } from '../utils/userGuards';
import Login from './login';

export const getServerSideProps = withUserGuard();

const Index: NextPage = () => {
  return <Login />;
};

export default Index;
