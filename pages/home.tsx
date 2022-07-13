import EventCard from '../src/components/EventCard';
import { withUserGuard } from '../utils/userGuards';

export const getServerSideProps = withUserGuard();

export default function Home() {
  return <div></div>;
}
