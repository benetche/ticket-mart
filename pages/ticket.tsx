import {
  Container,
  Paper,
  Typography,
  Button,
  CssBaseline,
  Grid,
  Box,
  TextField,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import QRcode from '../assets/qrCode.png';
import Image from 'next/image';
import styles from './Styles/ticket.module.css';
import { colorPallete } from '../src/theme';
import { useState } from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function Ticket() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
              <Button onClick={handleOpen}>Transferir Ingresso</Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography variant="h5">Transferir Ticket</Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    As transferências só são permitidas até 12h antes do evento
                  </Typography>
                  <TextField
                    style={{ marginTop: '10px' }}
                    placeholder="Email do Destinatario"
                    fullWidth
                  ></TextField>
                  <TextField
                    style={{ marginTop: '10px' }}
                    placeholder="Cpf do Destinatario"
                    fullWidth
                  ></TextField>
                  <Button
                    variant="contained"
                    color="success"
                    style={{ marginTop: '10px' }}
                    fullWidth
                  >
                    Transferir
                  </Button>
                </Box>
              </Modal>
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
