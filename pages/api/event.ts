import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../src/database/conn';
import { Event } from '../../src/database/models/Event';
import { ClientError, getErrorMessage } from '../../utils/errors';
import { isValidNumber } from '../../utils/validate';
import { withMethodsAndSessionRoute } from '../../utils/withMethods';
import { Ticket } from '../../src/database/models/Ticket';

export default withMethodsAndSessionRoute({
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectToDatabase();

      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: 'Não autorizado!' });
      }

      const queryMaxEvents = Number(req.query.maxEvents);

      const maxEvents =
        isValidNumber(queryMaxEvents) && queryMaxEvents > 0
          ? queryMaxEvents
          : 0;

      const events = await Event.find({}).sort({ date: 1 }).limit(maxEvents);

      return res.status(200).json(events);
    } catch (e) {
      res.status(500);
      console.error(e);
      return res.json({ message: 'Erro interno do servidor!' });
    }
  },
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
    const {
      name,
      description,
      date,
      location,
      price,
      imageUrl,
      stockQuantity,
    } = body;

    try {
      await connectToDatabase();

      const event = new Event({
        name,
        description,
        date,
        location,
        price,
        imageUrl,
        stockQuantity,
      });

      await event.validate().catch((err) => {
        throw new ClientError(getErrorMessage(err));
      });

      await event.save();

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
    if (
      req.session.user?.email === undefined &&
      req.session.user?.type !== 'admin'
    ) {
      return res.status(401).json({
        message: 'Não autorizado!',
      });
    }

    const body = req.body ?? {};
    const {
      id,
      name,
      description,
      date,
      location,
      price,
      imageUrl,
      stockQuantity,
    } = body;

    try {
      await connectToDatabase();

      const toEdit = await Event.findById(id);

      if (toEdit === null) {
        throw new ClientError('Evento não cadastrado!');
      }

      const tickets = await Ticket.find({ event: toEdit._id });

      if (stockQuantity < tickets.length) {
        throw new ClientError('Não é possível alterar ingressos já emitidos!');
      }

      toEdit.name = name;
      toEdit.description = description;
      toEdit.date = date;
      toEdit.location = location;
      toEdit.price = price;
      toEdit.imageUrl = imageUrl;
      toEdit.stockQuantity = stockQuantity;

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

    try {
      await connectToDatabase();

      const toDelete = await Event.findById(id);

      if (toDelete === null) {
        throw new ClientError('Evento não cadastrado!');
      }

      const tickets = await Ticket.find({ event: toDelete._id });

      if (tickets.length > 0) {
        throw new ClientError(
          'Não é possível excluir eventos com ingressos emitidos!'
        );
      }

      await toDelete.remove();

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
