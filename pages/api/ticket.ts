import { IronSession } from 'iron-session';
import mongoose, { ClientSession, isValidObjectId } from 'mongoose';
import { connectToDatabase } from '../../src/database/conn';
import { ITicketFull, Ticket } from '../../src/database/models/Ticket';
import { User } from '../../src/database/models/User';
import { ClientError } from '../../utils/errors';
import { isValidEmail } from '../../utils/validate';
import { withMethodsAndSessionRoute } from '../../utils/withMethods';

export default withMethodsAndSessionRoute({
  PATCH: async (req, res) => {
    if (req.session.user?.email === undefined) {
      return res.status(401).json({
        message: 'Não autorizado!',
      });
    }

    const body = req.body ?? {};

    let mongoSession: ClientSession | undefined;

    try {
      await connectToDatabase();

      mongoSession = await mongoose.startSession();
      mongoSession.startTransaction();

      const { ticketId, destinataryEmail } = body;

      if (!isValidObjectId(ticketId) || !isValidEmail(destinataryEmail)) {
        throw new ClientError('Dados para transferência inválidos!');
      }

      if (req.session.user.email === destinataryEmail) {
        throw new ClientError(
          'Não é possível transferir um ticket para si mesmo!'
        );
      }

      const me = await User.findOne({ email: req.session.user.email }).session(
        mongoSession
      );

      if (me === null) {
        return res.status(401).json({
          message: 'Não autorizado!',
        });
      }

      const they = await User.findOne({ email: destinataryEmail }).session(
        mongoSession
      );

      if (they === null) {
        throw new ClientError('Email de destinatário não está cadastrado!');
      }

      const ticket = await Ticket.findById(ticketId).session(mongoSession);

      if (ticket === null) {
        throw new ClientError('Ticket inexistente!');
      }

      if (ticket.user.toString() !== me._id.toString()) {
        throw new ClientError('Ticket não pertence a você!');
      }

      const transactionPromises = [];

      transactionPromises.push(
        User.updateOne(
          { _id: me._id },
          { $pull: { tickets: ticketId } }
        ).session(mongoSession)
      );

      transactionPromises.push(
        User.updateOne(
          { _id: they._id },
          { $push: { tickets: ticketId } }
        ).session(mongoSession)
      );

      ticket.user = they._id;

      transactionPromises.push(ticket.save({ session: mongoSession }));

      await Promise.all(transactionPromises);

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

export const getAllUserTickets = async (session: IronSession) => {
  try {
    await connectToDatabase();

    const userEmail = session.user?.email;

    if (!userEmail) {
      throw new Error('Não autorizado!');
    }
    const userTickets = await User.findOne(
      { email: userEmail },
      'tickets'
    ).populate({
      path: 'tickets',
      populate: {
        path: 'event',
      },
    });

    if (userTickets === null) {
      throw new Error('Não autorizado!');
    }

    return userTickets.tickets as ITicketFull[];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getTicketInfo = async (session: IronSession, ticketId: string) => {
  try {
    const userEmail = session.user?.email;

    if (!userEmail) {
      throw new Error('Não autorizado!');
    }

    await connectToDatabase();

    const me = await User.findOne({ email: userEmail });

    if (me === null) {
      throw new Error('Não autorizado!');
    }

    const ticket = await Ticket.findById(ticketId).populate('event');

    if (
      ticket !== null &&
      (ticket.user as mongoose.Types.ObjectId).toString() !== me._id.toString()
    ) {
      throw new Error('Não autorizado!');
    }

    return ticket as ITicketFull | null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
