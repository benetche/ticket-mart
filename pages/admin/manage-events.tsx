import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Switch,
} from '@mui/material';
import React from 'react';
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

const EventDetails = ({ openModal, setOpenModal }) => {
  const handleClose = () => setOpenModal(false);
  const [edit, setEdit] = React.useState(false);
  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h5">Detalhes do Evento</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="row" spacing={2}>
          <Grid item>
            <FormControl>
              <FormControlLabel
                control={
                  <Switch color="info" onChange={() => setEdit(!edit)} />
                }
                label="Editar"
              />
            </FormControl>
          </Grid>
          <Grid item container direction="row">
            <Typography>Total vendido: </Typography>
            <Typography fontWeight="bold">x</Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              disabled={!edit}
              type="text"
              label="Nome do Evento"
              value="Nome teste"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              disabled={!edit}
              type="date"
              label="Data do Evento"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              disabled={!edit}
              type="text"
              value="Local teste"
              label="Local do Evento"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              disabled={!edit}
              label="Valor do Ingresso"
              fullWidth
              required
              type="number"
              value="10"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              disabled={!edit}
              type="number"
              value="300"
              label="Estoque"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              disabled={!edit}
              type="text"
              value="http://teste"
              label="URL do Banner"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item sm={12} xs={12}>
            <TextField
              disabled={!edit}
              label="Descrição do Evento"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              type="text"
              multiline
              value="blablabla"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ m: 2 }}>
        <Button color="info" variant="contained">
          Concluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function ManageEvents() {
  const [openModal, setOpenModal] = React.useState(true);
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
        <EventDetails openModal={openModal} setOpenModal={setOpenModal} />
      </Grid>
    </Grid>
  );
}
