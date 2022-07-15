import mongoose, { ClientSession } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../src/database/conn';
import { User } from '../../src/database/models/User';
import { ClientError, getErrorMessage } from '../../utils/errors';
import { isValidString } from '../../utils/validate';
import { withMethodsAndSessionRoute } from '../../utils/withMethods';
import { ITicket } from '../../src/database/models/Ticket';
import { IEvent } from '../../src/database/models/Event';

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
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    if (
      req.session.user?.email === undefined &&
      req.session.user?.type !== 'admin'
    ) {
      return res.status(401).json({
        message: 'Não autorizado!',
      });
    }

    const body = req.body ?? {};
    const { id, name, type, email, password } = body;

    try {
      await connectToDatabase();

      const toEdit = await User.findById(id);

      if (toEdit === null) {
        throw new ClientError('Usuário não cadastrado!');
      }

      toEdit.name = name;
      toEdit.type = type;
      toEdit.email = email;
      if (isValidString(password)) {
        toEdit.password = password;
      }

      await toEdit.validate().catch((err) => {
        throw new ClientError(getErrorMessage(err));
      });

      await toEdit.save();

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

  DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
    if (
      req.session.user?.email === undefined &&
      req.session.user?.type !== 'admin'
    ) {
      return res.status(401).json({
        message: 'Não autorizado!',
      });
    }

    const body = req.body ?? {};
    const { id } = body;

    let mongoSession: ClientSession | undefined;

    try {
      await connectToDatabase();

      mongoSession = await mongoose.startSession();
      mongoSession.startTransaction();

      const toDelete = await User.findById(id)
        .populate({
          path: 'tickets',
          populate: {
            path: 'event',
          },
        })
        .session(mongoSession);

      if (toDelete === null) {
        throw new ClientError('Usuário não cadastrado!');
      }

      const promises = [];

      const changedEvents: { [key: string]: IEvent } = {};

      for (const ticket of (toDelete.tickets ?? []) as ITicket[]) {
        const event = ticket.event as IEvent;
        if (changedEvents[event._id.toString()] === undefined) {
          changedEvents[event._id.toString()] = event;
        }
        changedEvents[event._id.toString()].stockQuantity += 1;
        promises.push(ticket.remove({ session: mongoSession }));
      }

      for (const event of Object.values(changedEvents)) {
        promises.push(event.save({ session: mongoSession }));
      }

      promises.push(toDelete.remove({ session: mongoSession }));

      await Promise.all(promises);

      await mongoSession.commitTransaction();
      await mongoSession.endSession();

      return res.status(200).end();
    } catch (e) {
      await mongoSession?.abortTransaction();
      await mongoSession?.endSession();

      res.status(500);
      if (e instanceof ClientError) {
        return res.json({ message: e.message });
      }

      console.error(e);
      return res.json({ message: 'Erro interno do servidor!' });
    }
  },
});
