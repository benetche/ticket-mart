import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../src/database/conn';
import { User } from '../../../src/database/models/User';
import { ClientError } from '../../../utils/errors';
import { isValidEmail, isValidString } from '../../../utils/validate';
import { withMethodsAndSessionRoute } from '../../../utils/withMethods';

export default withMethodsAndSessionRoute({
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body ?? {};
    const { email, password } = body;

    try {
      await connectToDatabase();

      if (!isValidEmail(email) || !isValidString(password)) {
        throw new ClientError('Email ou senha inválidos!');
      }

      const user = await User.findOne({ email }, '+password');

      if (user === null) {
        throw new ClientError('Email ou senha inválidos!');
      }

      if (!(await user.validatePassword(password))) {
        throw new ClientError('Email ou senha inválidos!');
      }

      req.session.user = {
        email: user.email,
        name: user.name,
        type: user.type,
        phone: user.phone,
      };

      await req.session.save();

      return res.status(200).end();
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
