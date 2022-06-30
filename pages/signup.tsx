import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import Image from 'next/image';
import Logo from '../assets/logo.png';
import styles from './Styles/login.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await fetch('http://localhost:3000/users', {
      method: 'POST',
      body: JSON.stringify({
        name: `${name}`,
        email: `${email}`,
        password: `${password}`,
      }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then(() => console.log('Enviado com sucesso!'))
      .then(() => router.push('/login'));
  };

  return (
    <Grid container style={{ minHeight: '100vh' }}>
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
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.flexContainer}>
            <Grid container justifyContent="center">
              <div className={styles.loginHeader}>
                <Image alt="Tik.me" src={Logo} />
                <h2>Cadastrar</h2>
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
              label="Nome"
              type="text"
              required
              margin="normal"
              onChange={(e) => {
                setName(e.target.value);
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
            <div>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                style={{ width: '100%' }}
              >
                Cadastrar
              </Button>
            </div>
            <div>
              <Link href="/login">
                <Button style={{ width: '100%' }}>Já sou membro</Button>
              </Link>
            </div>
          </div>
        </form>
        <div />
      </Grid>
    </Grid>
  );
}
