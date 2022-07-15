import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import EventCardAdmin from '../../src/components/EventCardAdmin';

// const EventContainer = ({ events }: { events: ExploreProps['events'] }) => {
//   return (
//     <Grid container direction="row" spacing={2}>
//       {events.map((event) => {
//         return (
//           <Grid item sm={4} xs={12} key={event._id}>
//             <EventCardAdmin event={event} />
//           </Grid>
//         );
//       })}
//     </Grid>
//   );
// };

export default function ManageEvents() {
  return (
    <Grid container flex={1} p={4} direction="column">
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={8} mb={1}>
          <Typography variant="h5" fontWeight="bold">
            Gerenciar Eventos
          </Typography>
        </Grid>
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
            color="success"
          >
            Buscar
          </Button>
        </Grid>
        {/* <EventContainer/> */}
      </Grid>
    </Grid>
  );
}
