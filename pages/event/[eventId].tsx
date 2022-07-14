import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContentText,
  Paper,
  Typography,
  Grid,
  Button,
  CardMedia,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AttachMoney, CalendarMonth } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { colorPallete } from '../../src/theme';
import { BasicUserInfoSSR, withUserGuard } from '../../utils/userGuards';
import { connectToDatabase } from '../../src/database/conn';
import { Event as EventModel, IEvent } from '../../src/database/models/Event';
import { cloudinaryImage } from '../../utils/utils';
import { useState } from 'react';
import axios from 'axios';

interface EventProps {
  event: Omit<IEvent, 'date'> & { date: string };
  currentCartQuantity: number;
  user: BasicUserInfoSSR;
}

export const getServerSideProps = withUserGuard<Omit<EventProps, 'user'>>(
  async (ctx) => {
    await connectToDatabase();

    const event = await EventModel.findOne({ _id: ctx.query.eventId });

    if (event === null) {
      return {
        notFound: true,
      };
    }

    const currentCartQuantity =
      ctx.req.session.cart?.[ctx.query.eventId as string]?.quantity ?? 0;

    return {
      props: {
        event: JSON.parse(JSON.stringify(event)) as EventProps['event'],
        currentCartQuantity,
      },
    };
  }
);
0;

export default function Event({ event, currentCartQuantity }: EventProps) {
  interface ModalContent {
    title: string;
    description: string;
    isError: boolean;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContent>();
  const [cartQuantity, setCartQuantity] = useState<number>(currentCartQuantity);

  async function addToCart() {
    setDialogOpen(true);

    setLoading(true);

    try {
      const res = await axios.put('/api/cart', {
        eventId: event._id,
        quantity: 1,
      });

      if (res.status === 200) {
        setCartQuantity(cartQuantity + 1);

        setModalContent({
          title: `${event.name} adicionado ao carrinho!`,
          description:
            'O ingresso foi adicionado ao carrinho com sucesso! Deseja continuar comprando?',
          isError: false,
        });
      } else {
        throw {
          response: res,
        };
      }
    } catch (err: any) {
      setModalContent({
        title: 'Erro ao adicionar ao carrinho!',
        description: err?.response?.data?.message ?? 'Erro desconhecido!',
        isError: true,
      });
    }

    setLoading(false);
  }

  return (
    <>
      <Grid
        direction="row"
        justifyContent="center"
        minHeight="100vh"
        container
        sx={{
          p: 5,
          backgroundColor: colorPallete.claret,
        }}
      >
        <Grid item maxWidth="md">
          <CardMedia
            sx={{ marginBottom: '10px', borderRadius: '8px', height: '300px' }}
            component="img"
            image={cloudinaryImage(event.imageUrl)}
            alt="Banner do Evento"
          />

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              style={{ borderBottom: '1px solid black', padding: '20px' }}
            >
              <Grid item>
                <Grid item>
                  <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    {event.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="body1"
                    style={{ verticalAlign: 'middle', display: 'inline-flex' }}
                  >
                    <AttachMoney />{' '}
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(event.price)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="body1"
                    style={{ verticalAlign: 'middle', display: 'inline-flex' }}
                  >
                    <CalendarMonth />{' '}
                    {new Date(event.date).toLocaleDateString('pt-BR')}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="body1"
                    style={{ verticalAlign: 'middle', display: 'inline-flex' }}
                  >
                    <LocationOnIcon /> {event.location}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addToCart()}
                >
                  Adicionar Ingresso ao Carrinho
                </Button>
                <Grid item>
                  <Typography variant="body2">
                    {event.stockQuantity - cartQuantity} ingressos restantes
                  </Typography>
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
                <Typography variant="body1">{event.description}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        open={dialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {loading ? (
          <DialogContent>
            <Grid container justifyContent="center">
              <CircularProgress sx={{ mb: 2 }} />
            </Grid>
          </DialogContent>
        ) : (
          <>
            <DialogTitle id="alert-dialog-title">
              {modalContent?.title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {modalContent?.description}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {!modalContent?.isError && (
                <Button href="/cart">Ir para o carrinho</Button>
              )}
              <Button
                onClick={() => {
                  setDialogOpen(false);
                }}
                autoFocus
              >
                {modalContent?.isError ? 'Fechar' : 'Continuar comprando'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
