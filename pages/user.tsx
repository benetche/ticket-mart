import {
  Grid,
  Card,
  Dialog,
  DialogContent,
  CircularProgress,
  Typography,
  CardContent,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { BasicUserInfoSSR, withUserGuard } from '../utils/userGuards';
import { isValidString, isValidEmail } from '../utils/validate';
import { useRouter } from 'next/router';

interface UserPageProps {
  user: BasicUserInfoSSR;
}

export const getServerSideProps = withUserGuard();

export default function UserPage({ user }: UserPageProps) {
  interface UserInfo {
    name: string;
    email: string;
    phone: string;
    password: string;
  }

  interface SnackBarMessage {
    message: string;
    type: 'success' | 'error';
  }

  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: user.name ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    password: '',
  });

  const [snackBar, setSnackBar] = useState<SnackBarMessage | null>(null);

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  function hasChanged() {
    return (
      (userInfo.phone ?? '') !== (user.phone ?? '') ||
      (userInfo.name ?? '') !== (user.name ?? '') ||
      (userInfo.email ?? '') !== (user.email ?? '') ||
      userInfo.password !== ''
    );
  }

  function validateName(): string | undefined {
    if (!userInfo.name || userInfo.name.length < 3) {
      return 'Insira um nome válido!';
    }
  }

  function validatePassword(): string | undefined {
    if (userInfo.password === '') {
      return;
    }

    if (!isValidString(userInfo.password) || userInfo.password.length < 8) {
      return 'Insira uma senha válida!';
    }
  }

  function validateEmail(): string | undefined {
    if (!isValidEmail(userInfo.email)) {
      return 'Insira um e-mail válido!';
    }
  }

  function validateAll(): string | undefined {
    return validateName() || validateEmail() || validatePassword();
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
      const res = await axios.patch('/api/user', userInfo);

      if (res.status === 200) {
        setSnackBar({
          message: 'Usuário alterado com sucesso!',
          type: 'success',
        });
        setSubmitted(true);

        setTimeout(() => {
          router.reload();
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
          err?.response?.data?.message ??
          'Erro desconhecido ao alterar usuário!',
      });
    }

    setLoading(false);
  }

  return (
    <>
      <Grid container direction="column" p={4} style={{ flex: 1 }}>
        <Grid item>
          <Typography variant="h5">Perfil do Usuário</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">Edite seu perfil</Typography>
        </Grid>
        <Grid item sx={{ mt: 2 }} xs={12}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography textAlign={'center'} variant="body1">
                      <strong>Dados do Usuário</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nome"
                      error={!!validateName()}
                      value={userInfo.name}
                      helperText={validateName()}
                      fullWidth
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, name: e.target.value });
                      }}
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Telefone"
                      value={userInfo.phone}
                      fullWidth
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^[0-9()\s+\-]*$/.test(e.target.value)) {
                          e.preventDefault();
                          e.target.value = e.target.value.slice(0, -1);
                          return;
                        }

                        setUserInfo({ ...userInfo, phone: value });
                      }}
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      fullWidth
                      value={userInfo.email}
                      error={!!validateEmail()}
                      helperText={validateEmail()}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, email: e.target.value });
                      }}
                      type="email"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Senha"
                      error={!!validatePassword()}
                      helperText={validatePassword()}
                      value={userInfo.password}
                      fullWidth
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, password: e.target.value });
                      }}
                      type="password"
                    />
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
                        disabled={
                          loading ||
                          submitted ||
                          !hasChanged() ||
                          !!validateAll()
                        }
                        variant="contained"
                        color="secondary"
                        size="large"
                        style={{ width: '40%' }}
                        type="submit"
                      >
                        Salvar Alterações
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
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
