import { Grid, TextField, Button } from '@mui/material';
import EventCard from '../src/EventCard';
export default function Explore() {
  return (
    <Grid direction="row" container p={4} sm={12}>
      <Grid direction="column" item xs={12} sm={8}>
        <Grid item>
          <TextField
            variant="outlined"
            label="Buscar Evento"
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>
      <Grid direction="column" item sm={4} xs>
        <Button variant="contained" color="success">
          Buscar
        </Button>
      </Grid>
      <Grid container direction="row">
        <Grid item sm={4} xs={12}>
          <EventCard />
        </Grid>
        <Grid item sm={4} xs={12}>
          <EventCard />
        </Grid>
        <Grid item sm={4} xs={12}>
          <EventCard />
        </Grid>
      </Grid>
    </Grid>
  );
}
