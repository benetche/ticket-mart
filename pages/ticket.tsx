import {
  Container,
  Paper,
  Typography,
  Button,
  CssBaseline,
  Grid,
} from '@mui/material';
import QRcode from '../assets/qrCode.png';
import Image from 'next/image';
import styles from './Styles/ticket.module.css';
import { colorPallete } from '../src/theme';

export default function Ticket() {
  return (
    <Grid
      direction="row"
      justifyContent="center"
      container
      sx={{
        p: 5,
        backgroundColor: colorPallete.secondary,
      }}
    >
      <Grid maxWidth="sm" item>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <div className={styles.flexRowDiv}>
            <div>
              <div className={styles.field}>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Nome do Evento
                </Typography>
                <Typography variant="body1">Evento</Typography>
              </div>
              <div className={styles.field}>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Titular
                </Typography>
                <Typography variant="body1">Nome</Typography>
                <Typography variant="body1">CPF</Typography>
              </div>
            </div>
            <Image src={QRcode} alt="Qr Code" />
          </div>
          <div className={styles.flexRowDiv}>
            <div className={styles.field}>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                Tipo de Ingresso
              </Typography>
              <Typography variant="body1">Lote #1</Typography>
              <Typography variant="body1">
                <strong>Valor: </strong>R$10,00
              </Typography>
            </div>
            <div className={styles.field}>
              <Button>Transferir Ingresso</Button>
            </div>
          </div>
          <div
            style={{
              height: '200px',
              backgroundColor: 'grey',
              margin: '20px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            Banner promocional
          </div>
          <div className={styles.field}>
            <Typography variant="body1">Id do ingresso</Typography>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}
