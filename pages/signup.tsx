import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import Image from 'next/image';
import Logo from '../assets/logo.png';
import styles from './Styles/login.module.css';
import Link from '../src/components/Link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { withUserGuard } from '../utils/userGuards';

export const getServerSideProps = withUserGuard();

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signupMessage, setSignupMessage] = useState<{
    severity: 'success' | 'error';
    message: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.put('/api/user/register', {
        email,
        password,
        name,
      });

      if (res.status === 201) {
        setSignupMessage({
          severity: 'success',
          message: 'Nova conta criada com sucesso! Faça login para continuar!',
        });
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        throw {
          response: res,
        };
      }
    } catch (err: any) {
      setSignupMessage({
        severity: 'error',
        message: err?.response?.data?.message ?? 'Erro ao criar conta!',
      });
    }

    setLoading(false);
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
        <form onSubmit={handleSubmit}>
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
              sx={{ mb: 2 }}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              label="Nome"
              type="text"
              required
              sx={{ mb: 2 }}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              label="Senha"
              type="password"
              required
              sx={{ mb: 2 }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            {loading && (
              <Grid container justifyContent="center">
                <CircularProgress sx={{ mb: 2 }} />
              </Grid>
            )}

            {signupMessage && (
              <Alert sx={{ mb: 2 }} severity={signupMessage.severity}>
                {signupMessage.message}
              </Alert>
            )}
            <div>
              <Button
                sx={{ mb: 2, width: '100%' }}
                color="primary"
                variant="contained"
                type="submit"
              >
                Cadastrar
              </Button>
            </div>
            <div>
              <Link href="/">
                <Button sx={{ mb: 2, width: '100%' }}>Já sou membro</Button>
              </Link>
            </div>
          </div>
        </form>
        <div />
      </Grid>
    </Grid>
  );
}
