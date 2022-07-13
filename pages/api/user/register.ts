import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../src/database/conn';
import { User } from '../../../src/database/models/User';
import { ClientError, getErrorMessage } from '../../../utils/errors';
import { withMethodsRoute } from '../../../utils/withMethods';

export default withMethodsRoute({
  PUT: async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body ?? {};
    const { name, email, password } = body;

    try {
      await connectToDatabase();

      const user = new User({
        name,
        email,
        password,
      });

      await user.validate().catch((err) => {
        throw new ClientError(getErrorMessage(err));
      });

      await user.save();

      return res.status(201).end();
    } catch (e) {
      res.status(500);
      if (e instanceof ClientError) {
        return res.json({ message: e.message });
      }

      console.error(e);
      return res.json({ message: 'Erro interno do servidor!' });
    }
  },
});
