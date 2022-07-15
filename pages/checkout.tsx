import {
  Grid,
  Card,
  Dialog,
  DialogContent,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  CardContent,
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { SentimentVeryDissatisfied } from '@mui/icons-material';
import axios from 'axios';
import { useState } from 'react';
import { BasicUserInfoSSR, withUserGuard } from '../utils/userGuards';
import { CompleteCartItem, getCompleteCartItems } from './api/cart';
import { isValidCPF, isValidNumber, isValidString } from '../utils/validate';
import { range } from '../utils/utils';
import type { PurchaseInfo } from './api/checkout';
import { useRouter } from 'next/router';

interface CheckoutProps {
  cartItems: (CompleteCartItem & { date: string })[];
  user: BasicUserInfoSSR;
}

export const getServerSideProps = withUserGuard<Omit<CheckoutProps, 'user'>>(
  async (ctx) => {
    const completeCart = await getCompleteCartItems(ctx.req.session);
    return {
      props: {
        cartItems: JSON.parse(
          JSON.stringify(completeCart)
        ) as CheckoutProps['cartItems'],
      },
    };
  }
);

export default function Checkout({ user, cartItems }: CheckoutProps) {
  interface SnackBarMessage {
    message: string;
    type: 'success' | 'error';
  }

  const now = new Date();

  const router = useRouter();

  const [purchaseInfo, setPurchaseInfo] = useState<PurchaseInfo>({
    cardExpMonth: now.getMonth() + 1,
    cardExpYear: now.getFullYear(),
    phone: user.phone ?? '',
  });

  const [snackBar, setSnackBar] = useState<SnackBarMessage | null>(null);

  const [bought, setBought] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  function validateCPF(submitting = false): string | undefined {
    if (submitting) {
      if (!purchaseInfo.cpf) {
        return 'Insira um CPF!';
      }
      if (!isValidCPF(purchaseInfo.cpf)) {
        return 'Insira um CPF válido!';
      }
    } else {
      if (!purchaseInfo.cpf || purchaseInfo.cpf.length !== 11) {
        return;
      }
      if (!isValidCPF(purchaseInfo.cpf)) {
        return 'Insira um CPF válido!';
      }
    }
  }

  function validateExpireDate(): string | undefined {
    if (
      purchaseInfo.cardExpMonth < 1 ||
      purchaseInfo.cardExpMonth > 12 ||
      purchaseInfo.cardExpYear < now.getFullYear() ||
      purchaseInfo.cardExpYear > now.getFullYear() + 10 ||
      (purchaseInfo.cardExpYear === now.getFullYear() &&
        purchaseInfo.cardExpMonth < now.getMonth() + 1)
    ) {
      return 'Insira uma data de expiração válida!';
    }
  }

  function validateCardNumber(): string | undefined {
    if (purchaseInfo.cardNumber?.length !== 16) {
      return 'Insira um número de cartão válido!';
    }
  }

  function validateCardCVV(): string | undefined {
    if (purchaseInfo.cardCVV?.length !== 3) {
      return 'Insira um número CVV válido!';
    }
  }

  function validateCardHolderName(): string | undefined {
    if (
      !purchaseInfo.cardHolderName ||
      purchaseInfo.cardHolderName.length < 3
    ) {
      return 'Insira o nome do titular do cartão válido!';
    }
  }

  function validatePhone(): string | undefined {
    if (!isValidString(purchaseInfo.phone)) {
      return 'Insira um número de telefone!';
    }
  }

  function validateAll(): string | undefined {
    return (
      validatePhone() ||
      validateCPF(true) ||
      validateCardHolderName() ||
      validateCardNumber() ||
      validateCardCVV() ||
      validateExpireDate()
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      const res = await axios.post('/api/checkout', { purchaseInfo });

      if (res.status === 200) {
        setSnackBar({
          message: 'Compra realizada com sucesso!',
          type: 'success',
        });
        setBought(true);

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
          'Erro desconhecido ao realizar a compra!',
      });
    }

    setLoading(false);
  }

  return cartItems.length > 0 ? (
    <>
      <Grid container direction="column" p={4} style={{ flex: 1 }}>
        <Grid item>
          <Typography variant="h5">Checkout</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            Verifique e finalize sua compra:
          </Typography>
        </Grid>
        <Grid item sx={{ mt: 2 }} xs={12}>
          <Card>
            <CardContent>
              <Grid
                container
                direction="column"
                spacing={2}
                justifyContent={'center'}
              >
                <Grid item>
                  <Typography variant="h6">Resumo da compra:</Typography>
                </Grid>
                <Grid item>
                  <Grid container direction="column" spacing={2}>
                    {cartItems.map((item) => (
                      <Grid item key={item._id}>
                        <Typography variant="body1">
                          <strong>{item.name}:</strong> {item.quantity}{' '}
                          Ingresso(s) -{' '}
                          {Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item.price)}
                        </Typography>
                      </Grid>
                    ))}
                    <Grid item>
                      <Typography variant="body1">
                        <strong>Valor Total:</strong>{' '}
                        {Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(
                          cartItems.reduce(
                            (acc, item) => acc + item.price * item.quantity,
                            0
                          )
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sx={{ mt: 2 }} xs={12}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Telefone do Comprador"
                      fullWidth
                      value={purchaseInfo.phone}
                      type="tel"
                      onChange={(e) => {
                        if (!/^[0-9()\s+\-]*$/.test(e.target.value)) {
                          e.preventDefault();
                          e.target.value = e.target.value.slice(0, -1);
                          return;
                        }

                        setPurchaseInfo({
                          ...purchaseInfo,
                          phone: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      label="CPF do Comprador"
                      helperText={validateCPF()}
                      error={validateCPF() !== undefined}
                      fullWidth
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!isValidNumber(Number(value))) {
                          e.target.value = e.target.value.slice(0, -1);
                          e.preventDefault();
                          return;
                        }
                        setPurchaseInfo({ ...purchaseInfo, cpf: value });
                      }}
                      inputProps={{
                        maxLength: 11,
                      }}
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography textAlign={'center'} variant="body1">
                      <strong>Dados do Cartão</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      label="Nome do Titular do Cartão"
                      fullWidth
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase();
                        setPurchaseInfo({
                          ...purchaseInfo,
                          cardHolderName: e.target.value,
                        });
                      }}
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="Número do Cartão"
                      fullWidth
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!isValidNumber(Number(value))) {
                          e.target.value = e.target.value.slice(0, -1);
                          e.preventDefault();
                          return;
                        }
                        setPurchaseInfo({ ...purchaseInfo, cardNumber: value });
                      }}
                      type="text"
                      inputProps={{
                        maxLength: 16,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="CVV"
                      fullWidth
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!isValidNumber(Number(value))) {
                          e.target.value = e.target.value.slice(0, -1);
                          e.preventDefault();
                          return;
                        }
                        setPurchaseInfo({ ...purchaseInfo, cardCVV: value });
                      }}
                      type="text"
                      inputProps={{
                        maxLength: 3,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="exp-month-label">
                        Mês de Vencimento
                      </InputLabel>
                      <Select
                        label="Mês de Vencimento"
                        labelId="exp-month-label"
                        error={validateExpireDate() !== undefined}
                        value={purchaseInfo.cardExpMonth}
                        fullWidth
                        onChange={(e) => {
                          setPurchaseInfo({
                            ...purchaseInfo,
                            cardExpMonth: Number(e.target.value),
                          });
                        }}
                      >
                        {range(1, 12).map((month) => (
                          <MenuItem key={month} value={month}>
                            {month}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText
                        error={validateExpireDate() !== undefined}
                      >
                        {validateExpireDate()}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="exp-year-label">
                        Ano de Vencimento
                      </InputLabel>
                      <Select
                        label="Ano de Vencimento"
                        labelId="exp-year-label"
                        value={purchaseInfo.cardExpYear}
                        fullWidth
                        onChange={(e) => {
                          setPurchaseInfo({
                            ...purchaseInfo,
                            cardExpYear: Number(e.target.value),
                          });
                        }}
                        error={validateExpireDate() !== undefined}
                      >
                        {range(now.getFullYear(), now.getFullYear() + 10).map(
                          (month) => (
                            <MenuItem key={month} value={month}>
                              {month}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText
                        error={validateExpireDate() !== undefined}
                      >
                        {validateExpireDate()}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Grid
                      direction="column"
                      container
                      justifyContent="center"
                      alignContent="center"
                      mt={2}
                    >
                      <Button
                        disabled={
                          loading || bought || validateAll() !== undefined
                        }
                        variant="contained"
                        color="secondary"
                        size="large"
                        style={{ width: '40%' }}
                        type="submit"
                      >
                        Finalizar Compra
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
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
