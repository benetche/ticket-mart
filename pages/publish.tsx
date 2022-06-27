import {
  Grid,
  TextField,
  Typography,
  styled,
  Button,
  Paper,
} from '@mui/material';
import { useState } from 'react';
import { json } from 'stream/consumers';
const PublishForm = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fetch('http://localhost:3000/requests', {
          method: 'POST',
          body: JSON.stringify({
            name: `${name}`,
            surname: `${surname}`,
            email: `${email}`,
            tel: `${tel}`,
            description: `${desc}`,
          }),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(() => console.log('Enviado com sucesso!'));
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nome"
            required
            fullWidth
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Sobrenome"
            fullWidth
            required
            type="text"
            onChange={(e) => {
              setSurname(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            fullWidth
            required
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Telefone"
            fullWidth
            required
            type="tel"
            onChange={(e) => {
              setTel(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Descrição Breve"
            fullWidth
            required
            type="text"
            multiline
            onChange={(e) => {
              setDesc(e.target.value);
            }}
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
