import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Background from '../assets/bg.png';
import { styled } from '@mui/system';
import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';

const EventTitle = styled(Typography)(() => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));
function EventTicket({ title, date }: { title: string; date: string }) {
  const [data, setData] = useState({});

  return (
    <Card sx={{ margin: '10px 0 10px 0' }}>
      <CardMedia
        component="img"
        height="100"
        image="https://res.cloudinary.com/htkavmx5a/image/upload/c_scale,f_auto,h_348,q_auto/nnckiy0znnljhgc6tely"
        alt="Banner do Evento"
      />
      <CardContent>
        <EventTitle gutterBottom variant="h5">
          {title}
        </EventTitle>
        <Typography variant="body1" color="text.secondary">
          {date}
        </Typography>
      </CardContent>
      <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined" color="success" href="/ticket">
          Ver ticket
        </Button>
      </CardActions>
    </Card>
  );
}

export default function MyTickets() {
  return (
    <Grid container p={4} sm={12} style={{ flex: 1 }} spacing={2}>
      <Grid item sm={3} xs={12}>
        <EventTicket title="Tusca" date="11/02/2022"></EventTicket>
      </Grid>
      <Grid item sm={3} xs={12}>
        <EventTicket title="Tusca" date="11/02/2022"></EventTicket>
      </Grid>
    </Grid>
  );
}
