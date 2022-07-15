import { connectToDatabase } from '../src/database/conn';
import { withUserGuard } from '../utils/userGuards';
import Home, { HomeProps } from './home';
import { Event } from '../src/database/models/Event';

export const getServerSideProps = withUserGuard<{
  events: HomeProps['events'];
}>(async (_ctx) => {
  await connectToDatabase();

  const events = await Event.find()
    .gt('stockQuantity', 0)
    .gt('date', new Date())
    .sort({ date: 1 })
    .limit(3);
  return {
    props: {
      events: JSON.parse(JSON.stringify(events)) as HomeProps['events'],
    },
  };
});

export default function Index({ user, events }: HomeProps) {
  return <Home user={user} events={events} />;
}
