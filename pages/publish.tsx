import { Grid, TextField, Typography, styled } from '@mui/material';

const PublishForm = () => {
  const Field = styled(Grid)(() => ({
    marginTop: '10px',
  }));
  return (
    <Grid container spacing={2}>
      <Grid item sm={4}>
        <TextField label="Nome" required fullWidth />
      </Grid>
      <Grid item sm={8}>
        <TextField label="Sobrenome" fullWidth required />
      </Grid>
    </Grid>
  );
};

export default function Publish() {
  return (
    <Grid container style={{ flex: 1 }} p={4} direction="column">
      <Grid item>
        <Typography variant="h5" fontWeight="bold">
          Publicar Evento
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Preencha o formulário e entraremos em contato em breve.
        </Typography>
      </Grid>
      <PublishForm />
    </Grid>
  );
}
