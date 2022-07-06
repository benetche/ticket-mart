import {
  Grid,
  Card,
  Box,
  Typography,
  CardContent,
  Paper,
  TextField,
} from '@mui/material';
import { useState } from 'react';
const CartCard = () => {
  const price: number = 20;
  const [amount, setAmount] = useState<number>(1);
  return (
    <Card sx={{ margin: '10px 0 10px 0', alignItems: 'center' }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'start' }}>
        <Grid container direction="row">
          <Grid item sm={2}>
            <Typography variant="h5">1</Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant="h5">Ticket - Nome do Evento</Typography>
          </Grid>

          <Grid item sm={6} sx={{ display: 'flex', justifyContent: 'end' }}>
            <Typography variant="h5">Preço: R${price * amount}</Typography>
            <input
              style={{ width: '60px', marginLeft: '10px' }}
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default function Cart() {
  return (
    <Grid container direction="column" p={4} sm={12} style={{ flex: 1 }}>
      <Grid item>
        <Typography variant="h5">Meu Carrinho</Typography>
      </Grid>
      <Grid item sm={12} xs={12}>
        <CartCard />
      </Grid>
    </Grid>
  );
}
