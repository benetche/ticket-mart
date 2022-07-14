import { IronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../src/database/conn';
import { Event } from '../../src/database/models/Event';
import { ClientError } from '../../utils/errors';
import { isValidNumber, isValidString } from '../../utils/validate';
import { withMethodsAndSessionRoute } from '../../utils/withMethods';

export interface CompleteCartItem {
  _id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  quantity: number;
}

export default withMethodsAndSessionRoute({
  PUT: async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.session.user?.email === undefined) {
      return res.status(401).json({
        message: 'Não autorizado!',
      });
    }

    const body = req.body ?? {};
    const { eventId, quantity = 1 } = body;

    try {
      await connectToDatabase();

      if (!isValidString(eventId)) {
        throw new ClientError('Evento inexistente!');
      }

      if (!isValidNumber(quantity, true)) {
        throw new ClientError('A quantidade deve ser um número positivo!');
      }

      const event = await Event.findOne({ _id: eventId }, 'stockQuantity');

      if (event === null) {
        throw new ClientError('Evento inexistente!');
      }

      const currQuantity = req.session.cart?.[eventId]?.quantity ?? 0;

      if (event.stockQuantity < quantity + currQuantity) {
        throw new ClientError('Não há quantidade suficiente no estoque!');
      }

      if (req.session.cart?.[eventId] === undefined) {
        req.session.cart = {
          ...(req.session.cart ?? {}),
          [eventId]: {
            _id: eventId,
            quantity,
          },
        };
      } else {
        req.session.cart[eventId].quantity += quantity;
      }

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

  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.session.user?.email === undefined) {
      return res.status(401).json({
        message: 'Não autorizado!',
      });
    }

    try {
      return res.status(200).json(await getCompleteCartItems(req.session));
    } catch (e) {
      res.status(500);
      console.error(e);
      return res.json({ message: 'Erro interno do servidor!' });
    }
  },
  DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.session.user?.email === undefined) {
      return res.status(401).json({
        message: 'Não autorizado!',
      });
    }

    const body = req.body ?? {};
    const { eventId } = body;

    try {
      if (eventId === 'all') {
        req.session.cart = {};
        await req.session.save();
        return res.status(200).end();
      }

      if (!isValidString(eventId)) {
        throw new ClientError('Evento inexistente!');
      }

      if (req.session.cart?.[eventId] === undefined) {
        throw new ClientError('Evento não está no carrinho!');
      }

      delete req.session.cart[eventId];

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
  PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.session.user?.email === undefined) {
      return res.status(401).json({
        message: 'Não autorizado!',
      });
    }

    const body = req.body ?? {};
    const { eventId, quantity } = body;

    try {
      await connectToDatabase();

      if (!isValidString(eventId)) {
        throw new ClientError('Evento inexistente!');
      }

      if (!isValidNumber(quantity, true)) {
        throw new ClientError('A quantidade deve ser um número positivo!');
      }

      if (req.session.cart?.[eventId] === undefined) {
        throw new ClientError('Evento não está no carrinho!');
      }

      const event = await Event.findOne({ _id: eventId }, 'stockQuantity');

      if (event === null) {
        throw new ClientError('Evento inexistente!');
      }

      if (event.stockQuantity < quantity) {
        throw new ClientError('Não há quantidade suficiente no estoque!');
      }

      req.session.cart[eventId].quantity = quantity;

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

export const getCompleteCartItems = async (session: IronSession) => {
  await connectToDatabase();

  const cart = session.cart ?? {};

  const events = await Event.find({ _id: { $in: Object.keys(cart) } });

  const eventsWithQuantity = events.map((event) => {
    const quantity = cart[event._id].quantity;
    return {
      ...event.toObject(),
      quantity,
    };
  }) as CompleteCartItem[];
  return eventsWithQuantity;
};
