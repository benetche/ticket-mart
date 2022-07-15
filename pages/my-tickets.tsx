import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { Grid } from '@mui/material';
import { BasicUserInfoSSR, withUserGuard } from '../utils/userGuards';
import { SentimentVeryDissatisfied } from '@mui/icons-material';
import { getAllUserTickets } from './api/ticket';
import { ITicketFull } from '../src/database/models/Ticket';
import Link from '../src/components/Link';
interface MyTicketsProps {
  user: BasicUserInfoSSR;
  tickets: ITicketFull[];
}

const EventTitle = styled(Typography)(() => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const getServerSideProps = withUserGuard<Omit<MyTicketsProps, 'user'>>(
  async (ctx) => {
    const tickets = await getAllUserTickets(ctx.req.session);
    return {
      props: {
        tickets: JSON.parse(
          JSON.stringify(tickets)
        ) as MyTicketsProps['tickets'],
      },
    };
  }
);

function EventTicket({ ticket }: { ticket: ITicketFull }) {
  return (
    <Card sx={{ margin: '10px 0 10px 0' }}>
      <CardMedia
        component="img"
        height="100"
        image={ticket.event.imageUrl}
        alt="Banner do Evento"
      />
      <CardContent>
        <EventTitle gutterBottom variant="h5">
          {ticket.event.name}
        </EventTitle>
        <Typography variant="body1" color="text.secondary">
          {new Date(ticket.event.date).toLocaleDateString('pt-BR')}
        </Typography>
      </CardContent>
      <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
        <Link href={`/ticket/${ticket._id}`} style={{ textDecoration: 'none' }}>
          <Button variant="outlined" color="primary">
            Ver ticket
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

export default function MyTickets({ tickets }: MyTicketsProps) {
  return tickets.length > 0 ? (
    <Grid container p={4} style={{ flex: 1 }} spacing={2}>
      {tickets.map((ticket) => (
        <Grid key={ticket._id.toString()} item sm={3} xs={12}>
          <EventTicket ticket={ticket}></EventTicket>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Grid container direction="row" justifyContent="center">
      <Grid item xs={12}>
        <Typography sx={{ textAlign: 'center' }} variant="h5">
          Nenhum Ticket pra chamar de seu!
        </Typography>
      </Grid>
      <Grid item xs={12} container direction="row" justifyContent="center">
        <SentimentVeryDissatisfied fontSize="large" />
      </Grid>
    </Grid>
  );
}
