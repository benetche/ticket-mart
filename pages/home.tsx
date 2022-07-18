import { Grid, Card, CardMedia, Typography, Button } from '@mui/material';
import EventCard from '../src/components/EventCard';
import { connectToDatabase } from '../src/database/conn';
import { IEvent, Event } from '../src/database/models/Event';
import { BasicUserInfoSSR, withUserGuard } from '../utils/userGuards';
import Carousel from 'react-material-ui-carousel';
import Link from '../src/components/Link';

export interface HomeProps {
  events: (Omit<IEvent, 'date'> & { date: string })[];
  user: BasicUserInfoSSR;
}

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

function NonSelectableImage(props: any) {
  return (
    <div
      {...props}
      style={{
        ...props.style,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: `${props.height}px`,
        width: '100%',
      }}
    />
  );
}

export default function Home({ events }: HomeProps) {
  return (
    <Grid container direction="row" justifyContent="center">
      <Grid
        md={10}
        sm={11}
        xs={12}
        lg={8}
        item
        container
        direction="column"
        justifyContent="center"
        // spacing={2}
        p={2}
        sx={{ mt: 4 }}
      >
        <Grid width={'100%'} item>
          <Carousel height={250}>
            {events.map((event) => (
              <Card key={event._id.toString()}>
                <CardMedia
                  height={250}
                  component={NonSelectableImage}
                  alt={event.name}
                  image={event.imageUrl}
                ></CardMedia>
              </Card>
            ))}
          </Carousel>
        </Grid>
        <Grid item sx={{ textAlign: 'center' }} m={4}>
          <Typography variant="h5" fontWeight="bold">
            Principais Eventos
          </Typography>
        </Grid>
        <Grid container direction="row" spacing={2}>
          {events.map((event) => (
            <Grid item sm={4} xs={12} key={event._id.toString()}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
        <Grid item textAlign="center" m={4}>
          <Link href="/explore" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: '20rem' }}
            >
              Todos os Eventos
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}
