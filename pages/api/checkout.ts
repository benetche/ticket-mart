import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../src/database/conn';
import { Event } from '../../src/database/models/Event';
import { ClientError } from '../../utils/errors';
import { isValidCPF, isValidString } from '../../utils/validate';
import { withMethodsAndSessionRoute } from '../../utils/withMethods';
import { ITicket, Ticket } from '../../src/database/models/Ticket';
import { User } from '../../src/database/models/User';
import mongoose, { ClientSession } from 'mongoose';

export interface PurchaseInfo {
  phone?: string;
  cpf?: string;
  cardNumber?: string;
  cardExpMonth: number;
  cardExpYear: number;
  cardCVV?: string;
  cardHolderName?: string;
}

export default withMethodsAndSessionRoute({
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
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

      const me = await User.findOne({ email: req.session.user.email }).session(
        mongoSession
      );

      if (me === null) {
        return res.status(401).json({
          message: 'Não autorizado!',
        });
      }

      const cartItems = req.session.cart ?? {};

      if (Object.keys(cartItems).length === 0) {
        throw new ClientError('Carrinho vazio!');
      }

      const events = await Event.find({
        _id: { $in: Object.keys(cartItems) },
      }).session(mongoSession);

      for (const event of events) {
        const currQuantity = cartItems[event._id.toString()]?.quantity ?? 0;

        if (event.stockQuantity < currQuantity) {
          throw new ClientError(
            `Não há quantidade suficiente no estoque para o item ${event.name}!`
          );
        }
      }

      const purchaseInfo: PurchaseInfo | undefined = body.purchaseInfo;

      if (purchaseInfo === undefined) {
        throw new ClientError('Informações de pagamento inválidas!');
      }

      const {
        phone,
        cpf,
        cardExpMonth,
        cardExpYear,
        cardNumber,
        cardCVV,
        cardHolderName,
      } = purchaseInfo;

      if (!isValidCPF(cpf)) {
        throw new ClientError('CPF inválido!');
      }

      if (!isValidString(phone)) {
        throw new ClientError('Telefone inválido!');
      }

      const now = new Date();

      if (
        cardCVV?.length !== 3 ||
        cardNumber?.length !== 16 ||
        cardHolderName === undefined ||
        cardHolderName.length < 3 ||
        cardExpMonth < 1 ||
        cardExpMonth > 12 ||
        cardExpYear < now.getFullYear() ||
        cardExpYear > now.getFullYear() + 10 ||
        (cardExpYear === now.getFullYear() && cardExpMonth < now.getMonth() + 1)
      ) {
        throw new ClientError('Informações do cartão inválidas!');
      }

      if (cardNumber === '1111111111111111') {
        throw new ClientError('Cartão recusado!');
      }

      const tickets: ITicket[] = [];

      const promises = [];

      for (const event of events) {
        const currQuantity = cartItems[event._id.toString()]?.quantity ?? 0;

        for (let i = 0; i < currQuantity; i++) {
          const ticket = new Ticket({
            event: event._id,
            user: me._id,
          });
          tickets.push(ticket);
          promises.push(ticket.save({ session: mongoSession }));
        }

        event.stockQuantity -= currQuantity;
        promises.push(event.save({ session: mongoSession }));
      }

      await Promise.all(promises);

      const saveTicketsPromises = [];

      for (const ticket of tickets) {
        saveTicketsPromises.push(
          User.updateOne(
            { _id: me._id },
            {
              $push: {
                tickets: ticket._id,
              },
            }
          ).session(mongoSession)
        );
      }

      me.phone = phone;

      saveTicketsPromises.push(me.save({ session: mongoSession }));

      await Promise.all(saveTicketsPromises);

      req.session.cart = {};
      req.session.user.phone = phone;

      await req.session.save();

      await mongoSession.commitTransaction();
      await mongoSession.endSession();

      return res.status(200).end();
    } catch (e: any) {
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
