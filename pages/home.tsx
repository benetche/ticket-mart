import EventCard from '../src/EventCard';
import { Grid, Card, CardMedia, Typography, Button } from '@mui/material';
export default function Home() {
  return (
    <Grid
      direction="column"
      flex={1}
      spacing={4}
      sx={{ mt: { sm: 4, xs: 6 }, m: { xs: 4 } }}
    >
      <Grid item sm={12}>
        <Card>
          <CardMedia
            component="img"
            alt="slider"
            image="https://res.cloudinary.com/htkavmx5a/image/upload/c_scale,f_auto,h_348,q_auto/nnckiy0znnljhgc6tely"
          ></CardMedia>
        </Card>
      </Grid>
      <Grid item sx={{ textAlign: 'center' }} m={4}>
        <Typography variant="h5" fontWeight="bold">
          Principais Eventos
        </Typography>
      </Grid>
      <Grid container direction="row" spacing={2}>
        <Grid item sm={4} xs={12}>
          <EventCard title="teste" date="11/12/2022" />
        </Grid>
        <Grid item sm={4} xs={12}>
          <EventCard title="teste" date="11/12/2022" />
        </Grid>
        <Grid item sm={4} xs={12}>
          <EventCard title="teste" date="11/12/2022" />
        </Grid>
      </Grid>
      <Grid item textAlign="center" m={4}>
        <Button variant="contained" color="success" fullWidth>
          Explorar Eventos
        </Button>
      </Grid>
    </Grid>
  );
}
