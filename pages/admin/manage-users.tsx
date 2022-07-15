import {
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Card,
  styled,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  Alert,
  Switch,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import React from 'react';
import { BasicUserInfoSSR, withUserGuard } from '../../utils/userGuards';
import { IUser, User } from '../../src/database/models/User';
import { connectToDatabase } from '../../src/database/conn';
import { useRouter } from 'next/router';
import { isValidEmail, isValidString } from '../../utils/validate';
import axios from 'axios';
import { normalizeStr } from '../../utils/utils';

interface ManageUsersProps {
  users: IUser[];
  user: BasicUserInfoSSR;
}

const UserName = styled(Typography)(() => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const getServerSideProps = withUserGuard<Omit<ManageUsersProps, 'user'>>(
  async (ctx) => {
    await connectToDatabase();
    const users = await User.find({
      email: { $ne: ctx.req.session.user?.email },
    }).sort({ name: 1 });
    return {
      props: {
        users: JSON.parse(JSON.stringify(users)) as IUser[],
      },
    };
  }
);

const UserCard = ({ user }: { user: IUser }) => {
  interface UserInfo {
    name: string;
    email: string;
    type: 'user' | 'admin';
    password: string;
  }

  interface SnackBarMessage {
    message: string;
    type: 'success' | 'error';
  }

  const router = useRouter();

  const [userInfo, setUserInfo] = React.useState<UserInfo>({
    name: user.name,
    email: user.email,
    type: user.type,
    password: '',
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const [snackBar, setSnackBar] = React.useState<SnackBarMessage | null>(null);

  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState(false);

  function hasChanged() {
    return (
      (userInfo.name ?? '') !== (user.name ?? '') ||
      (userInfo.email ?? '') !== (user.email ?? '') ||
      userInfo.type !== user.type ||
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

  async function handleSubmit() {
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
      const res = await axios.post('/api/user', {
        ...userInfo,
        id: user._id.toString(),
      });

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

  async function handleDelete() {
    setLoading(true);

    try {
      const res = await axios.delete('/api/user', {
        data: {
          id: user._id.toString(),
        },
      });

      if (res.status === 200) {
        setSnackBar({
          message: 'Usuário deletado com sucesso!',
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
          'Erro desconhecido ao deletar usuário!',
      });
    }

    setLoading(false);
  }

  return (
    <>
      <Card sx={{ margin: '10px 0 10px 0' }}>
        <Grid
          direction="row"
          container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          <Grid item>
            <UserName>{user.name}</UserName>
          </Grid>
          <Grid item>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              color="success"
            >
              Opções
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleModalOpen}>Detalhes</MenuItem>
              <MenuItem onClick={handleDelete}>Excluir</MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <Dialog open={openModal} onClose={handleModalClose}>
          <DialogTitle>
            <Typography variant="h5">Detalhes</Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container mt={2} spacing={2} direction="column">
              <Grid item>
                <TextField
                  type="text"
                  label="Nome"
                  value={userInfo.name}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, name: e.target.value })
                  }
                  error={!!validateName()}
                  helperText={validateName()}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  type="email"
                  label="Email"
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                  error={!!validateEmail()}
                  helperText={validateEmail()}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  label="Senha"
                  value={userInfo.password}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, password: e.target.value })
                  }
                  error={!!validatePassword()}
                  helperText={validatePassword()}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <FormGroup>
                  <FormControlLabel
                    checked={userInfo.type === 'admin'}
                    onChange={(e) => {
                      setUserInfo({
                        ...userInfo,
                        // @ts-ignore
                        type: e.target.checked ? 'admin' : 'user',
                      });
                    }}
                    control={<Switch color="primary" />}
                    label="Administrador"
                  ></FormControlLabel>
                </FormGroup>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ m: 2 }}>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={
                loading || submitted || !hasChanged() || !!validateAll()
              }
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
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
};

export default function ManageUsers({ users }: ManageUsersProps) {
  const [search, setSearch] = React.useState('');
  const [currUsers, setCurrUsers] = React.useState(users);

  function handleSearch() {
    if (search === '') {
      setCurrUsers(users);
    }
    const filtered = users.filter((user) =>
      normalizeStr(user.name).includes(normalizeStr(search))
    );
    setCurrUsers(filtered);
  }

  return (
    <Grid container flex={1} p={4} direction="column">
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={8} mb={1}>
          <Typography variant="h5" fontWeight="bold">
            Gerenciar Usuários
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} mb={1}>
          <TextField
            variant="outlined"
            label="Buscar Usuário"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            fullWidth
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3} mb={3}>
          <Button
            onClick={handleSearch}
            sx={{ height: '100%', width: '100%', fontSize: '1.1rem' }}
            variant="contained"
            color="secondary"
          >
            Buscar
          </Button>
        </Grid>
        <Grid item xs={12}>
          {currUsers.map((user) => (
            <UserCard user={user} key={user._id.toString()} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
