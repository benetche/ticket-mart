import {
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Card,
  styled,
  Menu,
  MenuItem,
} from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import React from 'react';
const UserName = styled(Typography)(() => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const UserCard = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Card sx={{ margin: '10px 0 10px 0' }}>
      <Grid
        direction="row"
        container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Grid item>
          <UserName>Nome do Usuário</UserName>
        </Grid>
        <Grid item>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            color="success"
          >
            Opções
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>Detalhes</MenuItem>
            <MenuItem onClick={handleClose}>Excluir</MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </Card>
  );
};

export default function ManageUsers() {
  return (
    <Grid container flex={1} p={4} direction="column">
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={8} mb={1}>
          <Typography variant="h5" fontWeight="bold">
            Gerenciar Usuários
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} mb={1}>
          <TextField
            variant="outlined"
            label="Buscar Usuário"
            fullWidth
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3} mb={3}>
          <Button
            sx={{ height: '100%', width: '100%', fontSize: '1.1rem' }}
            variant="contained"
            color="success"
          >
            Buscar
          </Button>
        </Grid>
        {/* <EventContainer/> */}
        <Grid item sm={2}>
          <UserCard></UserCard>
        </Grid>
      </Grid>
    </Grid>
  );
}
