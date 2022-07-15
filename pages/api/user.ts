import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../src/database/conn';
import { User } from '../../src/database/models/User';
import { ClientError, getErrorMessage } from '../../utils/errors';
import { isValidString } from '../../utils/validate';
import { withMethodsAndSessionRoute } from '../../utils/withMethods';

export default withMethodsAndSessionRoute({
  PUT: async (req: NextApiRequest, res: NextApiResponse) => {
    if (
      req.session.user?.email === undefined ||
      req.session.user?.type !== 'admin'
    ) {
      return res.status(401).json({
        message: 'Não autorizado!',
      });
    }

    const body = req.body ?? {};
    const { name, email, password, type } = body;

    try {
      await connectToDatabase();

      const user = new User({
        name,
        email,
        password,
        type,
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
  PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.session.user?.email === undefined) {
      return res.status(401).json({
        message: 'Não autorizado!',
      });
    }

    const body = req.body ?? {};
    const { name, phone, email, password } = body;

    try {
      await connectToDatabase();

      const me = await User.findOne({ email: req.session.user.email });

      if (me === null) {
        return res.status(401).json({
          message: 'Não autorizado!',
        });
      }

      me.name = name;
      me.phone = phone;
      me.email = email;
      if (isValidString(password)) {
        me.password = password;
      }

      await me.validate().catch((err) => {
        throw new ClientError(getErrorMessage(err));
      });

      req.session.user.email = email;
      req.session.user.name = name;
      req.session.user.phone = phone;

      await req.session.save();

      await me.save();

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
