import { Container } from '@mui/system';
import { Paper, Typography, Grid, Button } from '@mui/material';
import { AttachMoney, CalendarMonth } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
export default function Event() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#89043D',
        padding: '30px 0 0 0',
      }}
    >
      <Container
        component="main"
        maxWidth="sm"
        sx={{ mb: 4 }}
        style={{ minWidth: '70vw' }}
      >
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, md: 3 } }}
          style={{
            marginBottom: '5vh',
            minHeight: '30vh',
            backgroundColor: 'grey',
          }}
        >
          Banner
        </Paper>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            style={{ borderBottom: '1px solid black', padding: '20px' }}
          >
            <Grid item direction="column">
              <Grid item>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Nome do Evento
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body1"
                  style={{ verticalAlign: 'middle', display: 'inline-flex' }}
                >
                  <AttachMoney /> Valor do Ingresso
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body1"
                  style={{ verticalAlign: 'middle', display: 'inline-flex' }}
                >
                  <CalendarMonth /> Data do Evento
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body1"
                  style={{ verticalAlign: 'middle', display: 'inline-flex' }}
                >
                  <LocationOnIcon /> Localização do Evento
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success">
                Comprar Ingresso
              </Button>
              <Grid item>
                <Typography variant="body2">x ingressos restantes</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="row" style={{ padding: '20px' }}>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                Descrição
              </Typography>
            </Grid>
            <Grid item style={{ marginTop: '20px' }}>
              <Typography variant="body1">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrys standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}
