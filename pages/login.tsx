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
import axios from 'axios';
import { withUserGuard } from '../utils/userGuards';
import { useRouter } from 'next/router';
import { isValidString } from '../utils/validate';

export const getServerSideProps = withUserGuard();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<{
    severity: 'success' | 'error';
    message: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post('/api/user/login', {
        email,
        password,
      });

      if (res.status === 200) {
        setLoginMessage({
          severity: 'success',
          message: 'Login realizado com sucesso!',
        });

        if (isValidString(router.query.bounce)) {
          router.push(router.query.bounce);
        } else {
          router.push('/home');
        }
      } else {
        throw {
          response: res,
        };
      }
    } catch (err: any) {
      setLoginMessage({
        severity: 'error',
        message: err?.response?.data?.message ?? 'Erro ao fazer login!',
      });
    }

    setLoading(false);
  };

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
        <form onSubmit={handleSubmit}>
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
              sx={{ mb: 2 }}
              onChange={(e) => {
                setEmail(e.target.value);
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

            {loginMessage && (
              <Alert sx={{ mb: 2 }} severity={loginMessage.severity}>
                {loginMessage.message}
              </Alert>
            )}

            <Button
              sx={{ mb: 2, width: '100%' }}
              color="primary"
              variant="contained"
              type="submit"
            >
              Entrar
            </Button>

            <Link href="/recover-password">
              <Button sx={{ mb: 2, width: '100%' }}>Esqueci minha senha</Button>
            </Link>

            <Link href="/signup">
              <Button sx={{ mb: 2, width: '100%' }}>
                Ainda não é um membro?
              </Button>
            </Link>
          </div>
        </form>
        <div />
      </Grid>
    </Grid>
  );
}
