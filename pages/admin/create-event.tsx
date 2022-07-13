import {
  Grid,
  TextField,
  Typography,
  styled,
  Button,
  Paper,
  InputAdornment,
} from '@mui/material';
import { useState } from 'react';

const PublishForm = () => {
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="Nome do Evento" required fullWidth type="text" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            InputLabelProps={{ shrink: true }}
            label="Data do Evento"
            fullWidth
            required
            type="date"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Local do Evento" fullWidth required type="text" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Valor do Ingresso"
            fullWidth
            required
            type="number"
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
            required
            type="url"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Descrição do Evento"
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
            xs={12}
          >
            <Button
              variant="contained"
              color="success"
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
  );
};

export default function CreateEvent() {
  return (
    <Grid container flex={1} p={4} direction="column">
      <Grid item>
        <Typography variant="h5" fontWeight="bold">
          Criar Evento
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Preencha os campos abaixo corretamente para criar um novo evento.
        </Typography>
      </Grid>
      <PublishForm />
    </Grid>
  );
}
