import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Container } from '@mui/system';
import EventCard from '../src/EventCard';
import { SearchOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
const EventContainer = () => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((response) => {
        return response.json();
      })
      .then((finalData) => {
        setData(finalData);
      });
  }, []);

  return (
    <Grid container direction="row" spacing={2}>
      {data.map((card) => {
        return (
          <Grid item sm={4} xs={12} key={card.id}>
            <EventCard title={card.title} date={card.date} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default function Explore() {
  return (
    <Grid container direction="column" p={4} sm={12} style={{ flex: 1 }}>
      <Grid item>
        <Grid item xs={12} sm={8}>
          <TextField
            variant="outlined"
            label="Buscar Evento"
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
      </Grid>
      <EventContainer />
    </Grid>
  );
}
