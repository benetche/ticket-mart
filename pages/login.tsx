import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import Image from 'next/image';
import Logo from '../assets/logo.png';
import styles from './Styles/login.module.css';
import Link from 'next/link';
import Auth from '../src/Auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    Auth(email, password);
  }

  return (
    <Grid container item style={{ minHeight: '100vh' }} direction="row">
      <Grid
        item
        xs={false}
        sm={6}
        sx={{
          backgroundImage: 'url(https://wallpaperaccess.com/full/4526320.jpg)',
          backgroundRepeat: 'no-repeat',
        }}
      ></Grid>
      <Grid
        container
        item
        xs={12}
        sm={6}
        justifyContent="space-between"
        style={{ padding: 10 }}
        alignItems="center"
        direction="column"
      >
        <div />
        <form onSubmit={(e) => handleLogin(e)}>
          <div className={styles.flexContainer}>
            <Grid container justifyContent="center">
              <div className={styles.loginHeader}>
                <Image alt="Tik.me" src={Logo} />
                <h2>Fazer Login</h2>
              </div>
            </Grid>
            <TextField
              label="Email"
              type="email"
              required
              margin="normal"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              label="Senha"
              type="password"
              required
              margin="normal"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Link href="/recover-password">
              <Button>Esqueci minha senha</Button>
            </Link>

            <Button color="primary" variant="contained" type="submit">
              Entrar
            </Button>

            <Link href="/signup">
              <Button>Ainda não é um membro?</Button>
            </Link>
          </div>
        </form>
        <div />
      </Grid>
    </Grid>
  );
}
