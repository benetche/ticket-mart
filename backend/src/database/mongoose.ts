import mongoose from 'mongoose';

const URI: string =
  'mongodb+srv://beneti:tikmedatabase@tikme.4f4yy.mongodb.net/?retryWrites=true&w=majority';

export async function createDBConnection() {
  try {
    const OPTIONS: mongoose.ConnectOptions = {};
    console.log('Connecting to database...');
    let db = await mongoose.connect(URI, OPTIONS);
    return db;
  } catch (e) {
    console.error('Error while connecting to the database:');
    console.error(e);
    return null;
  }
}
