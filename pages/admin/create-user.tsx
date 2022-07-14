import {
  Grid,
  TextField,
  Typography,
  Button,
  Switch,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { useState } from 'react';

const UserForm = () => {
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="Email do Usuário" required fullWidth type="email" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Nome Completo" fullWidth required type="text" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Senha" fullWidth required type="password" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup>
            <FormControlLabel
              control={<Switch color="success" />}
              label="Conceder Admin"
            ></FormControlLabel>
          </FormGroup>
        </Grid>

        <Grid item xs={12} sm={12}>
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

export default function CreateUser() {
  return (
    <Grid container flex={1} p={4} direction="column">
      <Grid item>
        <Typography variant="h5" fontWeight="bold">
          Criar novo Usuário
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Preencha os campos necessários para criar um novo usuário.
        </Typography>
      </Grid>
      <UserForm />
    </Grid>
  );
}
