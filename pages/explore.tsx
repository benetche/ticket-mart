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
import { useState } from 'react';
import { normalizeStr } from '../utils/utils';

interface ExploreProps {
  events: (Omit<IEvent, 'date'> & { date: string })[];
  user: BasicUserInfoSSR;
}

export const getServerSideProps = withUserGuard<{
  events: ExploreProps['events'];
}>(async (_ctx) => {
  await connectToDatabase();
  const events = await Event.find()
    .gt('stockQuantity', 0)
    .gt('date', new Date())
    .sort({ date: -1 });

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
          <Grid item sm={4} xs={12} key={event._id.toString()}>
            <EventCard event={event} />
          </Grid>
        );
      })}
    </Grid>
  );
};

function filterEvents(
  events: ExploreProps['events'],
  filter: string
): ExploreProps['events'] {
  if (filter === '') return events;
  return events.filter((event) => {
    return normalizeStr(event.name).includes(normalizeStr(filter));
  });
}

export default function Explore({ events }: ExploreProps) {
  const [search, setSearch] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);

  function handleSearch() {
    setFilteredEvents(filterEvents(events, search));
  }

  return (
    <Grid container direction="column" p={4} sx={{ flex: 1 }}>
      <Grid container direction="row" justifyContent="space-around">
        <Grid item xs={12} sm={8} mb={1}>
          <TextField
            variant="outlined"
            label="Buscar Evento"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
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
            onClick={() => handleSearch()}
          >
            Buscar
          </Button>
        </Grid>
      </Grid>
      <EventContainer events={filteredEvents} />
    </Grid>
  );
}
