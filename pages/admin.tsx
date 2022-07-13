import { Grid, Typography, Paper, Button } from '@mui/material';

export default function AdminView() {
  return (
    <Grid textAlign="center" flex={1} m={4}>
      <Grid container item sm={12} direction="row" spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <Typography variant="h5">Eventos</Typography>
              </Grid>
              <Grid item>
                <Button variant="contained" color="success" fullWidth>
                  Gerenciar Eventos
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="success" fullWidth>
                  Adicionar evento
                </Button>
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
                <Button variant="contained" color="success" fullWidth>
                  Gerenciar Usuários
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="success" fullWidth>
                  Criar Usuário
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="success" fullWidth>
                  Gerenciar Administradores
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
