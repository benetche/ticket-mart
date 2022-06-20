import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Container } from '@mui/system';
import EventCard from '../src/EventCard';
import { SearchOutlined } from '@mui/icons-material';

const EventContainer = () => {
  return (
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
  );
};

export default function Explore() {
  return (
    <Grid direction="row" container p={4} sm={12}>
      <Grid direction="column" item xs={12} sm={8}>
        <Grid item>
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
      </Grid>
      <EventContainer />
      <EventContainer />
      <EventContainer />
    </Grid>
  );
}
