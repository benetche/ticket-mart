import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Background from '../assets/bg.png';
import { styled } from '@mui/system';

const EventTitle = styled(Typography)(() => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));
export default function EventCard() {
  return (
    <Card sx={{ margin: '10px 10px 10px 0' }}>
      <CardMedia
        component="img"
        height="100"
        image="https://res.cloudinary.com/htkavmx5a/image/upload/c_scale,f_auto,h_348,q_auto/nnckiy0znnljhgc6tely"
        alt="Banner do Evento"
      />
      <CardContent>
        <EventTitle gutterBottom variant="h5">
          Nome do Evento
        </EventTitle>
        <Typography variant="body1" color="text.secondary">
          Data do Evento
        </Typography>
      </CardContent>
      <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined" color="success">
          Acessar evento
        </Button>
      </CardActions>
    </Card>
  );
}
