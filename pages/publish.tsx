import {
  Grid,
  TextField,
  Typography,
  styled,
  Button,
  Paper,
} from '@mui/material';

const PublishForm = () => {
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="Nome" required fullWidth type="text" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Sobrenome" fullWidth required type="text" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Email" fullWidth required type="email" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Telefone" fullWidth required type="tel" />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Descrição Breve"
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
