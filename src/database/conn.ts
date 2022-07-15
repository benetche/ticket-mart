import { connect } from 'mongoose';
const { DB_URL } = process.env;
import './models/User';
import './models/Ticket';
import './models/Event';

export function connectToDatabase() {
  if (DB_URL === undefined) {
    throw new Error('Database is not configured!');
  }
  return connect(DB_URL, { appName: 'ticket-mart' });
}
