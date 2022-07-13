import { connect } from 'mongoose';
const { DB_URL } = process.env;

export function connectToDatabase() {
  if (DB_URL === undefined) {
    throw new Error('Database is not configured!');
  }
  return connect(DB_URL, { appName: 'ticket-mart' });
}
