import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import Image from 'next/image';
import BackgroundImage from '../assets/bg-alt.jpg';
import Logo from '../assets/logo.png';
import styles from './login.module.css';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        >
          <h3 style={{ color: 'white' }}>Enjoy your time!</h3>
        </Grid>
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
                <Button style={{ width: '100%' }}>
                  Ainda não é um membro?
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
