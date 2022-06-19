import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import Image from 'next/image';
import Logo from '../assets/logo.png';
import styles from './login.module.css';
import { useRouter } from 'next/router';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  return (
    <div>
      <Grid container style={{ minHeight: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={6}
          sx={{
            backgroundImage:
              'url(https://wallpaperaccess.com/full/4526320.jpg)',
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
          <form>
            <div className={styles.flexContainer}>
              <Grid container justifyContent="center">
                <div className={styles.loginHeader}>
                  <Image src={Logo}></Image>
                  <h2>Recuperar senha</h2>
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
              <TextField label="Nome" type="text" required margin="normal" />
              <TextField
                label="Senha"
                type="password"
                required
                margin="normal"
              />
              <div>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  style={{ width: '100%' }}
                >
                  Entrar
                </Button>
              </div>
              <div>
                <Button
                  style={{ width: '100%' }}
                  onClick={() => {
                    router.push('/login');
                  }}
                >
                  Já sou membro
                </Button>
              </div>
            </div>
          </form>
          <div />
        </Grid>
      </Grid>
    </div>
  );
}
