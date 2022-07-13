import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  res.json({ message: 'pong' });
}
