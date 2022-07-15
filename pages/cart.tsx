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
import { SentimentVeryDissatisfied } from '@mui/icons-material';
import axios from 'axios';
import { useState } from 'react';
import { BasicUserInfoSSR, withUserGuard } from '../utils/userGuards';
import { CompleteCartItem, getCompleteCartItems } from './api/cart';
import Link from '../src/components/Link';

interface CartProps {
  cartItems: (CompleteCartItem & { date: string })[];
  user: BasicUserInfoSSR;
}

export const getServerSideProps = withUserGuard<Omit<CartProps, 'user'>>(
  async (ctx) => {
    const completeCart = await getCompleteCartItems(ctx.req.session);
    return {
      props: {
        cartItems: JSON.parse(
          JSON.stringify(completeCart)
        ) as CartProps['cartItems'],
      },
    };
  }
);

const CartCard = ({
  cartItem,
  idx,
  updateTotals,
  onDelete,
  onUpdate,
}: {
  cartItem: CompleteCartItem & { date: string };
  idx: number;
  onDelete: (id: string, idx: number) => void;
  updateTotals: (key: string, val: number) => void;
  onUpdate: (id: string, idx: number, quantity: number) => void;
}) => {
  const [amount, setAmount] = useState<number>(cartItem.quantity);

  return (
    <Card sx={{ margin: '10px 0 10px 0', alignItems: 'center' }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'start' }}>
        <Grid alignItems={'center'} container direction="row">
          <Grid
            item
            container
            md={2}
            xs={2}
            direction="row"
            justifyContent={'center'}
          >
            <Typography variant="h5" sx={{ mr: 2 }}>
              {idx}
            </Typography>
          </Grid>
          <Grid
            item
            md={3}
            xs={10}
            container
            direction="row"
            justifyContent={'center'}
          >
            <Typography variant="h5">{cartItem.name}</Typography>
          </Grid>

          <Grid
            item
            md={3}
            xs={8}
            container
            direction="row"
            justifyContent={'center'}
          >
            <Typography variant="h5">
              Valor Total:{' '}
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(cartItem.price * amount)}
            </Typography>
          </Grid>
          <Grid
            item
            md={2}
            xs={4}
            container
            direction="row"
            justifyContent={'center'}
          >
            <TextField
              sx={{ width: '100px', ml: 2, mr: 3 }}
              inputProps={{
                min: 1,
                max: cartItem.stockQuantity,
                style: { textAlign: 'center' },
              }}
              type="number"
              value={amount}
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              onChange={(e) => {
                const newAmount = Number(e.target.value);
                if (Number.isNaN(newAmount)) {
                  e.preventDefault();
                  return;
                }
                setAmount(newAmount);
                updateTotals(cartItem._id, newAmount * cartItem.price);
              }}
            />
          </Grid>
          <Grid
            item
            md={1}
            xs={6}
            container
            direction="row"
            justifyContent={'center'}
            sx={{ mt: { xs: 2, md: 0 } }}
          >
            <Button
              sx={{ mr: 2 }}
              variant="outlined"
              disabled={amount === cartItem.quantity}
              color="primary"
              onClick={() => {
                onUpdate(cartItem._id, idx - 1, amount);
              }}
            >
              Salvar
            </Button>
          </Grid>

          <Grid
            item
            md={1}
            xs={6}
            container
            direction="row"
            justifyContent={'center'}
            sx={{ mt: { xs: 2, md: 0 } }}
          >
            <Button
              onClick={() => onDelete(cartItem._id, idx - 1)}
              variant="contained"
              color="error"
            >
              Excluir
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default function Cart({ cartItems: initialCartItems }: CartProps) {
  interface SnackBarMessage {
    message: string;
    type: 'success' | 'error';
  }

  const initTotals = initialCartItems.reduce(
    (prev: Record<string, number>, cur: typeof cartItems[0]) => {
      prev[cur._id.toString()] = cur.price * cur.quantity;
      return prev;
    },
    {}
  );

  const initTotal = Object.values(initTotals).reduce(
    (prev, cur) => prev + cur,
    0
  );

  const [totalValue, setTotalValue] = useState<number>(initTotal);

  const [totals, setTotals] = useState<Record<string, number>>(initTotals);

  const [loading, setLoading] = useState<boolean>(false);

  const [snackBar, setSnackBar] = useState<SnackBarMessage | null>(null);

  const [cartItems, setCartItems] =
    useState<CartProps['cartItems']>(initialCartItems);

  const calcNewTotal = (ts: Record<string, number>): number =>
    Object.values(ts).reduce((prev, cur) => prev + cur, 0);

  function updateTotals(key: string, newTotal: number) {
    const newTotals = {
      ...totals,
      [key]: newTotal,
    };
    setTotals(newTotals);
    setTotalValue(calcNewTotal(newTotals));
  }

  async function deleteItem(id: string, idx: number) {
    setLoading(true);

    try {
      const res = await axios.delete('/api/cart', {
        data: {
          eventId: id,
        },
      });

      if (res.status === 200) {
        cartItems.splice(idx, 1);

        delete totals[id];

        setCartItems(cartItems);
        setTotals(totals);
        setTotalValue(calcNewTotal(totals));

        setSnackBar({
          message: 'Item excluído com sucesso',
          type: 'success',
        });
      } else {
        throw {
          response: res,
        };
      }
    } catch (err: any) {
      setSnackBar({
        message: err?.response?.data?.message || 'Erro desconhecido',
        type: 'error',
      });
    }

    setLoading(false);
  }

  async function updateItem(id: string, idx: number, newAmount: number) {
    setLoading(true);

    try {
      const res = await axios.patch('/api/cart', {
        eventId: id,
        quantity: newAmount,
      });

      if (res.status === 200) {
        cartItems[idx].quantity = newAmount;
        totals[id] = newAmount * cartItems[idx].price;

        setCartItems(cartItems);
        setTotals(totals);
        setTotalValue(calcNewTotal(totals));

        setSnackBar({
          message: 'Quantidade alterada com sucesso',
          type: 'success',
        });
      } else {
        throw {
          response: res,
        };
      }
    } catch (err: any) {
      setSnackBar({
        message: err?.response?.data?.message || 'Erro desconhecido',
        type: 'error',
      });
    }

    setLoading(false);
  }

  async function deleteAll() {
    setLoading(true);

    try {
      const res = await axios.delete('/api/cart', { data: { eventId: 'all' } });

      if (res.status === 200) {
        setCartItems([]);
        setTotals({});
        setTotalValue(0);

        setSnackBar({
          message: 'Todos os itens excluídos com sucesso',
          type: 'success',
        });
      } else {
        throw {
          response: res,
        };
      }
    } catch (err: any) {
      setSnackBar({
        message: err?.response?.data?.message || 'Erro desconhecido',
        type: 'error',
      });
    }
    setLoading(false);
  }

  return cartItems.length > 0 ? (
    <>
      <Grid container direction="column" p={4} style={{ flex: 1 }}>
        <Grid item>
          <Typography variant="h5">Meu Carrinho</Typography>
        </Grid>
        <Grid item sm={12} xs={12}>
          {cartItems.map((cartItem, idx) => (
            <CartCard
              onUpdate={updateItem}
              onDelete={deleteItem}
              key={cartItem._id}
              cartItem={cartItem}
              idx={idx + 1}
              updateTotals={updateTotals}
            />
          ))}
        </Grid>
        <Grid container alignContent={'center'}>
          <Grid
            item
            md={4}
            xs={12}
            container
            sx={{
              justifyContent: { xs: 'center', md: 'start' },
              mt: { xs: 2, md: 0 },
            }}
          >
            <Typography variant="h5">
              Total:{' '}
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalValue)}
            </Typography>
          </Grid>
          <Grid
            item
            md={8}
            xs={12}
            container
            sx={{
              justifyContent: { xs: 'space-around', md: 'end' },
              mt: { xs: 2, md: 0 },
            }}
          >
            <Button
              onClick={() => {
                deleteAll();
              }}
              sx={{ mr: { md: 2 } }}
              variant="outlined"
              color="error"
            >
              Esvaziar Carrinho
            </Button>
            <Link href="/checkout" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="secondary">
                Finalizar Compra
              </Button>
            </Link>
          </Grid>
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
  ) : (
    <Grid container direction="row" justifyContent="center">
      <Grid item xs={12}>
        <Typography sx={{ textAlign: 'center' }} variant="h5">
          Carrinho Vazio
        </Typography>
      </Grid>
      <Grid item xs={12} container direction="row" justifyContent="center">
        <SentimentVeryDissatisfied fontSize="large" />
      </Grid>
    </Grid>
  );
}
