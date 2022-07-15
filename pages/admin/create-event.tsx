import {
  Grid,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  Snackbar,
} from '@mui/material';
import { useState } from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import { withUserGuard } from '../../utils/userGuards';
import { useRouter } from 'next/router';
import { isValidNumber, isValidURL } from '../../utils/validate';
import axios from 'axios';

export const getServerSideProps = withUserGuard();

export default function CreateEvent() {
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

  const [snackBar, setSnackBar] = useState<SnackBarMessage | null>(null);

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  const [eventInfo, setEventInfo] = useState<Partial<EventInfo>>({
    date: dayjs(),
  });

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      const res = await axios.put('/api/event', {
        ...eventInfo,
        date: eventInfo.date?.hour(0).minute(0).second(0).millisecond(0),
      });

      if (res.status === 201) {
        setSnackBar({
          message: 'Evento criado com sucesso!',
          type: 'success',
        });
        setSubmitted(true);

        setTimeout(() => {
          router.push('/admin/manage-events');
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
          err?.response?.data?.message ?? 'Erro desconhecido ao criar evento!',
      });
    }

    setLoading(false);
  }

  return (
    <>
      <Grid container flex={1} p={4} direction="column">
        <Grid item>
          <Typography variant="h5" fontWeight="bold">
            Criar Evento
          </Typography>
        </Grid>
        <Grid item mb={2}>
          <Typography variant="body1">
            Preencha os campos abaixo corretamente para criar um novo evento.
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nome do Evento"
                onChange={(e) =>
                  setEventInfo({ ...eventInfo, name: e.target.value })
                }
                error={!!validateName()}
                helperText={validateName()}
                required
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Local do Evento"
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor do Ingresso"
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estoque"
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Banner do Evento (url)"
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
            <Grid item xs={12} sm={12}>
              <TextField
                label="Descrição do Evento"
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
              <Grid
                direction="column"
                container
                justifyContent="center"
                alignContent="center"
                mt={2}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={loading || submitted || !!validateAll()}
                  size="large"
                  style={{ width: '40%' }}
                  type="submit"
                >
                  Enviar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
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
}
