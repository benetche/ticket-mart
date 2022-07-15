import { Grid, Typography, Paper, Button } from '@mui/material';
import { withUserGuard } from '../utils/userGuards';
import Link from '../src/components/Link';

export const getServerSideProps = withUserGuard();

export default function AdminView() {
  return (
    <Grid textAlign="center" flex={1} m={4}>
      <Grid item m={2}>
        <Typography variant="h5" fontWeight="bold">
          Painel de Controle
        </Typography>
      </Grid>
      <Grid item m={2}>
        <Typography variant="body1">Seja bem-vindo, admin</Typography>
      </Grid>
      <Grid container item sm={12} direction="row" spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <Typography variant="h5">Eventos</Typography>
              </Grid>
              <Grid item>
                <Link
                  href="/admin/manage-events"
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="contained" color="primary" fullWidth>
                    Gerenciar Eventos
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="/admin/create-event"
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="contained" color="primary" fullWidth>
                    Adicionar evento
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/explore" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary" fullWidth>
                    Explorar Eventos
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <Typography variant="h5">Usuários</Typography>
              </Grid>
              <Grid item>
                <Link
                  href="/admin/manage-users"
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="contained" color="primary" fullWidth>
                    Gerenciar Usuários
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="/admin/create-user"
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="contained" color="primary" fullWidth>
                    Criar Usuário
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
