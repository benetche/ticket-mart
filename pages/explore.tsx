import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';

import EventCard from '../src/components/EventCard';
import { SearchOutlined } from '@mui/icons-material';

import { BasicUserInfoSSR, withUserGuard } from '../utils/userGuards';
import { connectToDatabase } from '../src/database/conn';
import { Event, IEvent } from '../src/database/models/Event';

interface ExploreProps {
  events: (Omit<IEvent, 'date'> & { date: string })[];
  user: BasicUserInfoSSR;
}

export const getServerSideProps = withUserGuard<{
  events: ExploreProps['events'];
}>(async (_ctx) => {
  await connectToDatabase();
  const nowInMillis = Date.now();
  const events = (await Event.find().gt('stockQuantity', 0)).sort((a, b) => {
    return (
      Math.abs(nowInMillis - new Date(a.date).getTime()) -
      Math.abs(nowInMillis - new Date(b.date).getTime())
    );
  });

  return {
    props: {
      events: JSON.parse(JSON.stringify(events)) as ExploreProps['events'],
    },
  };
});

const EventContainer = ({ events }: { events: ExploreProps['events'] }) => {
  return (
    <Grid container direction="row" spacing={2}>
      {events.map((event) => {
        return (
          <Grid item sm={4} xs={12} key={event._id}>
            <EventCard event={event} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default function Explore({ events }: ExploreProps) {
  return (
    <Grid container direction="column" p={4} sx={{ flex: 1 }}>
      <Grid container direction="row" justifyContent="space-around">
        <Grid item xs={12} sm={8} mb={1}>
          <TextField
            variant="outlined"
            label="Buscar Evento"
            fullWidth
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3} mb={3}>
          <Button
            sx={{ height: '100%', width: '100%', fontSize: '1.1rem' }}
            variant="contained"
            color="secondary"
          >
            Buscar
          </Button>
        </Grid>
      </Grid>
      <EventContainer events={events} />
    </Grid>
  );
}
