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
  Alert,
  Card,
  CircularProgress,
  FormGroup,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';
import React from 'react';
import { SearchOutlined } from '@mui/icons-material';
import { connectToDatabase } from '../../src/database/conn';
import { IEvent, Event } from '../../src/database/models/Event';
import dayjs from 'dayjs';
import { BasicUserInfoSSR, withUserGuard } from '../../utils/userGuards';
import axios from 'axios';
import { useRouter } from 'next/router';
import { userInfo } from 'os';
import { isValidNumber, isValidURL } from '../../utils/validate';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import user from '../user';
import { normalizeStr } from '../../utils/utils';

interface ManageEventProps {
  events: IEvent[];
  user: BasicUserInfoSSR;
}

export const getServerSideProps = withUserGuard<Omit<ManageEventProps, 'user'>>(
  async (ctx) => {
    await connectToDatabase();
    const events = await Event.find().sort({ name: 1 });
    return {
      props: {
        events: JSON.parse(JSON.stringify(events)) as IEvent[],
      },
    };
  }
);

const EventDetails = ({ event }: { event: IEvent }) => {
  interface EventInfo {
    name: string;
    description: string;
    date: dayjs.Dayjs;
    location: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
  }
  interface SnackBarMessage {
    message: string;
    type: 'success' | 'error';
  }

  const router = useRouter();

  const [eventInfo, setEventInfo] = React.useState<EventInfo>({
    name: event.name,
    description: event.description,
    date: dayjs(event.date),
    location: event.location,
    price: event.price,
    stockQuantity: event.stockQuantity,
    imageUrl: event.imageUrl,
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const [snackBar, setSnackBar] = React.useState<SnackBarMessage | null>(null);

  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState(false);

  function hasChanged() {
    return (
      eventInfo.name !== event.name ||
      eventInfo.description !== event.description ||
      !eventInfo.date.isSame(dayjs(event.date), 'date') ||
      eventInfo.location !== event.location ||
      eventInfo.price !== event.price ||
      eventInfo.stockQuantity !== event.stockQuantity ||
      eventInfo.imageUrl !== event.imageUrl
    );
  }

  function validateName(submitting = false): string | undefined {
    if (!submitting && (!eventInfo.name || eventInfo.name.length === 0)) {
      return;
    }

    if (!eventInfo.name || eventInfo.name.length < 3) {
      return 'Insira um nome válido!';
    }
  }

  function validateDescription(submitting = false): string | undefined {
    if (
      !submitting &&
      (!eventInfo.description || eventInfo.description.length === 0)
    ) {
      return;
    }

    if (!eventInfo.description || eventInfo.description.length < 50) {
      return 'Sua descrição deve conter no mínimo 50 caracteres!';
    }
  }

  function validateLocation(submitting = false): string | undefined {
    if (
      !submitting &&
      (!eventInfo.location || eventInfo.location.length === 0)
    ) {
      return;
    }

    if (!eventInfo.location) {
      return 'Insira um local válido!';
    }
  }

  function validatePrice(submitting = false): string | undefined {
    if (!submitting && eventInfo.price === undefined) {
      return;
    }

    if (!eventInfo.price || eventInfo.price < 0) {
      return 'Insira um preço válido!';
    }
  }

  function validateStockQuantity(submitting = false): string | undefined {
    if (!submitting && eventInfo.stockQuantity === undefined) {
      return;
    }

    if (!eventInfo.stockQuantity || eventInfo.stockQuantity < 0) {
      return 'Insira uma quantidade de estoque válida!';
    }
  }

  function validateImageUrl(submitting = false): string | undefined {
    if (
      !submitting &&
      (!eventInfo.imageUrl || eventInfo.imageUrl.length === 0)
    ) {
      return;
    }

    if (!eventInfo.imageUrl || !isValidURL(eventInfo.imageUrl)) {
      return 'Insira uma URL de imagem válida!';
    }
  }

  function validateDate(submitting = false): string | undefined {
    if (!submitting && eventInfo.date === undefined) {
      return;
    }

    if (
      !eventInfo.date ||
      eventInfo.date.isBefore(
        dayjs().hour(0).minute(0).second(0).millisecond(0)
      )
    ) {
      return 'Insira uma data válida!';
    }
  }

  function validateAll(): string | undefined {
    return (
      validateName(true) ||
      validateDate(true) ||
      validateLocation(true) ||
      validatePrice(true) ||
      validateStockQuantity(true) ||
      validateImageUrl(true) ||
      validateDescription(true)
    );
  }

  async function handleSubmit() {
    const error = validateAll();
    if (error) {
      setSnackBar({
        message: error,
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.patch('/api/event', {
        ...eventInfo,
        id: event._id.toString(),
      });

      if (res.status === 200) {
        setSnackBar({
          message: 'Evento alterado com sucesso!',
          type: 'success',
        });
        setSubmitted(true);

        setTimeout(() => {
          router.reload();
        }, 2000);
      } else {
        throw {
          response: res,
        };
      }
    } catch (err: any) {
      setSnackBar({
        type: 'error',
        message:
          err?.response?.data?.message ??
          'Erro desconhecido ao alterar evento!',
      });
    }

    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);

    try {
      const res = await axios.delete('/api/event', {
        data: {
          id: event._id.toString(),
        },
      });

      if (res.status === 200) {
        setSnackBar({
          message: 'Evento deletado com sucesso!',
          type: 'success',
        });
        setSubmitted(true);

        setTimeout(() => {
          router.reload();
        }, 2000);
      } else {
        throw {
          response: res,
        };
      }
    } catch (err: any) {
      setSnackBar({
        type: 'error',
        message:
          err?.response?.data?.message ??
          'Erro desconhecido ao deletar evento!',
      });
    }

    setLoading(false);
  }

  return (
    <>
      <Card sx={{ margin: '10px 0 10px 0' }}>
        <Grid
          direction="row"
          container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          <Grid item>
            <Typography
              sx={{
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {event.name}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              color="success"
            >
              Opções
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleModalOpen}>Detalhes</MenuItem>
              <MenuItem onClick={handleDelete}>Excluir</MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <Dialog open={openModal} onClose={handleModalClose}>
          <DialogTitle>
            <Typography variant="h5">Detalhes</Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container mt={2} spacing={2} direction="column">
              <Grid item>
                <TextField
                  type="text"
                  label="Nome"
                  value={eventInfo.name}
                  onChange={(e) =>
                    setEventInfo({ ...eventInfo, name: e.target.value })
                  }
                  error={!!validateName()}
                  helperText={validateName()}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <DesktopDatePicker
                  label="Data do Evento"
                  minDate={dayjs()}
                  inputFormat="DD/MM/YYYY"
                  value={eventInfo.date}
                  onChange={(value) => {
                    if (value) {
                      setEventInfo({ ...eventInfo, date: value });
                    }
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Local do Evento"
                  value={eventInfo.location}
                  onChange={(e) => {
                    setEventInfo({ ...eventInfo, location: e.target.value });
                  }}
                  error={!!validateLocation()}
                  helperText={validateLocation()}
                  fullWidth
                  required
                  type="text"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Valor do Ingresso"
                  fullWidth
                  value={eventInfo.price}
                  required
                  type="number"
                  inputProps={{
                    min: 0,
                  }}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isValidNumber(value)) {
                      e.target.value = e.target.value.slice(0, -1);
                      e.preventDefault();
                      return;
                    }
                    setEventInfo({ ...eventInfo, price: value });
                  }}
                  error={!!validatePrice()}
                  helperText={validatePrice()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Estoque"
                  value={eventInfo.stockQuantity}
                  fullWidth
                  required
                  type="number"
                  inputProps={{
                    min: 0,
                  }}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isValidNumber(value)) {
                      e.target.value = e.target.value.slice(0, -1);
                      e.preventDefault();
                      return;
                    }
                    setEventInfo({ ...eventInfo, stockQuantity: value });
                  }}
                  error={!!validateStockQuantity()}
                  helperText={validateStockQuantity()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">ingressos</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Banner do Evento (url)"
                  value={eventInfo.imageUrl}
                  fullWidth
                  onChange={(e) =>
                    setEventInfo({ ...eventInfo, imageUrl: e.target.value })
                  }
                  error={!!validateImageUrl()}
                  helperText={validateImageUrl()}
                  required
                  type="text"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Descrição do Evento"
                  value={eventInfo.description}
                  onChange={(e) =>
                    setEventInfo({ ...eventInfo, description: e.target.value })
                  }
                  error={!!validateDescription()}
                  helperText={validateDescription()}
                  fullWidth
                  required
                  type="text"
                  multiline
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ m: 2 }}>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={
                loading || submitted || !hasChanged() || !!validateAll()
              }
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackBar !== null}
        autoHideDuration={5000}
        onClose={() => setSnackBar(null)}
      >
        <Alert
          onClose={() => setSnackBar(null)}
          severity={snackBar?.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackBar?.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={loading}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container justifyContent="center">
            <CircularProgress sx={{ mb: 2 }} />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function ManageEvents({ events }: ManageEventProps) {
  const [currEvents, setCurrEvents] = React.useState(events);
  const [search, setSearch] = React.useState('');

  function handleSearch() {
    setCurrEvents(
      events.filter((event) =>
        normalizeStr(event.name).includes(normalizeStr(search))
      )
    );
  }

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            onClick={handleSearch}
            sx={{ height: '100%', width: '100%', fontSize: '1.1rem' }}
            variant="contained"
            color="secondary"
          >
            Buscar
          </Button>
        </Grid>
        <Grid item xs={12}>
          {currEvents.map((event) => (
            <EventDetails key={event._id.toString()} event={event} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
