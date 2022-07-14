import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { IEvent } from '../database/models/Event';

interface EventCardProps {
  event: Omit<IEvent, 'date'> & { date: string };
}

const EventTitle = styled(Typography)(() => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export default function EventCardAdmin({ event }: EventCardProps) {
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
          {event.name}
        </EventTitle>
        <Typography variant="body1" color="text.secondary" mb={1}>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(event.price)}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={1}>
          {event.location}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {new Date(event.date).toLocaleDateString('pt-BR')}
        </Typography>
      </CardContent>
      <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
        {/* COLOCAR HREF PARA ACESSAR CONFIG DO EVENTO */}
        <Button variant="outlined" color="primary">
          Acessar configurações
        </Button>
      </CardActions>
    </Card>
  );
}
