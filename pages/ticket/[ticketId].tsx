import {
  CardMedia,
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  Card,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  Snackbar,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useRouter } from 'next/router';
import styles from '.././Styles/ticket.module.css';
import { colorPallete } from '../../src/theme';
import { useState } from 'react';
import { ITicketFull } from '../../src/database/models/Ticket';
import { isValidObjectId } from 'mongoose';
import { getTicketInfo } from '../api/ticket';
import { BasicUserInfoSSR, withUserGuard } from '../../utils/userGuards';
import { cloudinaryImage } from '../../utils/utils';
import { useQRCode } from 'next-qrcode';
import { isValidEmail } from '../../utils/validate';
import axios from 'axios';

interface TicketProps {
  ticket: ITicketFull;
  user: BasicUserInfoSSR;
}

export const getServerSideProps = withUserGuard<Omit<TicketProps, 'user'>>(
  async (ctx) => {
    const { ticketId } = ctx.query;

    if (!isValidObjectId(ticketId)) {
      return {
        notFound: true,
      };
    }

    const ticket = await getTicketInfo(ctx.req.session, ticketId as string);

    if (ticket === null) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        ticket: JSON.parse(JSON.stringify(ticket)) as TicketProps['ticket'],
      },
    };
  }
);

export default function Ticket({ ticket, user }: TicketProps) {
  interface SnackBarMessage {
    message: string;
    type: 'success' | 'error';
  }
  const [snackBar, setSnackBar] = useState<SnackBarMessage | null>(null);
  const [loading, setLoading] = useState(false);

  const { Canvas } = useQRCode();

  const router = useRouter();
  const [destinataryEmail, setDestinataryEmail] = useState('');
  const [transfered, setTransfered] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function transferTicket() {
    if (!isValidEmail(destinataryEmail)) {
      setSnackBar({
        message: 'Insira um email válido',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.patch('/api/ticket', {
        ticketId: ticket._id,
        destinataryEmail,
      });

      if (res.status === 200) {
        setTransfered(true);

        setSnackBar({
          message: 'Ticket transferido com sucesso!',
          type: 'success',
        });

        handleClose();

        setTimeout(() => {
          router.push('/my-tickets');
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
          'Erro desconhecido ao transferir ticket!',
      });
    }

    setLoading(false);
  }

  return (
    <>
      <Grid
        direction="row"
        minHeight="100vh"
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
                  <Typography variant="body1">{ticket.event.name}</Typography>
                </div>
                <div className={styles.field}>
                  <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    Titular
                  </Typography>
                  <Typography variant="body1">{user.name}</Typography>
                </div>
              </div>
              <div
                style={{
                  height: '150px',
                  width: '150px',
                }}
              >
                <Canvas
                  text={JSON.stringify({
                    ticketId: ticket._id,
                    buyer: user.email ?? 'NULL',
                  })}
                  options={{
                    width: 150,
                    type: 'image/jpeg',
                    level: 'H',
                    margin: 3,
                    scale: 4,
                  }}
                />
              </div>
            </div>
            <div className={styles.flexRowDiv}>
              <div className={styles.field}>
                <Typography variant="body1">
                  <strong>Valor: </strong>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(ticket.event.price)}
                </Typography>
              </div>
              <div className={styles.field}>
                <Button
                  variant="outlined"
                  disabled={transfered}
                  onClick={handleOpen}
                >
                  Transferir Ingresso
                </Button>
              </div>
            </div>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={cloudinaryImage(ticket.event.imageUrl)}
                alt="Banner do Evento"
              />
            </Card>
            <Grid container justifyContent={'end'} mt={2} p={2}>
              <Typography variant="body2" fontSize="10px">
                {ticket._id.toString()}
              </Typography>
            </Grid>
          </Paper>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Transferir Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Informe o email do usuário para qual deseja enviar o ticket.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email do Destinatário"
            type="email"
            fullWidth
            variant="standard"
            value={destinataryEmail}
            onChange={(e) => setDestinataryEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={transferTicket}>Transferir</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
