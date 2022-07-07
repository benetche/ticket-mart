import express, { json } from 'express';
import { createDBConnection } from './database/mongoose';
import cors from 'cors';

async function main() {
  await createDBConnection();
  const server = express();
  server.use(cors());
  server.use(express.json());

  const PORT = 3003;
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
main();
