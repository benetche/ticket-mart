import {
  Grid,
  TextField,
  Typography,
  Button,
  Switch,
  FormGroup,
  FormControlLabel,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { withUserGuard } from '../../utils/userGuards';
import { isValidString, isValidEmail } from '../../utils/validate';

export const getServerSideProps = withUserGuard();

export default function CreateUser() {
  interface UserInfo {
    name: string;
    email: string;
    password: string;
    type: 'user' | 'admin';
  }

  interface SnackBarMessage {
    message: string;
    type: 'success' | 'error';
  }

  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    password: '',
    type: 'user',
  });

  const [snackBar, setSnackBar] = useState<SnackBarMessage | null>(null);

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  function validateName(submitting = false): string | undefined {
    if (!submitting && userInfo.name.length === 0) {
      return;
    }

    if (!userInfo.name || userInfo.name.length < 3) {
      return 'Insira um nome válido!';
    }
  }

  function validatePassword(submitting = false): string | undefined {
    if (!submitting && userInfo.password.length === 0) {
      return;
    }

    if (!isValidString(userInfo.password) || userInfo.password.length < 8) {
      return 'Insira uma senha válida!';
    }
  }

  function validateEmail(submitting = false): string | undefined {
    if (!submitting && userInfo.email.length === 0) {
      return;
    }

    if (!isValidEmail(userInfo.email)) {
      return 'Insira um e-mail válido!';
    }
  }

  function validateAll(): string | undefined {
    return validateName(true) || validateEmail(true) || validatePassword(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const error = validateAll();
    if (error) {
      setSnackBar({
        message: error,
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put('/api/user', userInfo);

      if (res.status === 201) {
        setSnackBar({
          message: 'Usuário criado com sucesso!',
          type: 'success',
        });
        setSubmitted(true);

        setTimeout(() => {
          router.push('/admin/manage-users');
        }, 2000);
      } else {
        throw {
          response: res,
        };
      }
    } catch (err: any) {
      setSnackBar({
        type: 'error',
        message:
          err?.response?.data?.message ?? 'Erro desconhecido ao criar usuário!',
      });
    }

    setLoading(false);
  }

  return (
    <>
      <Grid container flex={1} p={4} direction="column">
        <Grid item>
          <Typography variant="h5" fontWeight="bold">
            Criar novo Usuário
          </Typography>
        </Grid>
        <Grid item mb={4}>
          <Typography variant="body1">
            Preencha os campos necessários para criar um novo usuário.
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email do Usuário"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                error={!!validateEmail()}
                helperText={validateEmail()}
                required
                fullWidth
                type="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome Completo"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
                error={!!validateName()}
                helperText={validateName()}
                fullWidth
                required
                type="text"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Senha"
                value={userInfo.password}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, password: e.target.value })
                }
                error={!!validatePassword()}
                helperText={validatePassword()}
                fullWidth
                required
                type="password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormGroup>
                <FormControlLabel
                  control={<Switch color="primary" />}
                  onChange={(e) => {
                    //@ts-ignore
                    const checked = e.target.checked;

                    setUserInfo({
                      ...userInfo,
                      type: checked ? 'admin' : 'user',
                    });
                  }}
                  label="Conceder Acesso de Administrador"
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
              >
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={loading || submitted || !!validateAll()}
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
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackBar !== null}
        autoHideDuration={5000}
        onClose={() => setSnackBar(null)}
      >
        <Alert
          onClose={() => setSnackBar(null)}
          severity={snackBar?.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackBar?.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={loading}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container justifyContent="center">
            <CircularProgress sx={{ mb: 2 }} />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
