import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../src/database/conn';
import { Event } from '../../src/database/models/Event';
import { isValidNumber } from '../../utils/validate';
import { withMethodsAndSessionRoute } from '../../utils/withMethods';

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

      const events = await Event.find({}).sort({ date: -1 }).limit(maxEvents);

      return res.status(200).json(events);
    } catch (e) {
      res.status(500);
      console.error(e);
      return res.json({ message: 'Erro interno do servidor!' });
    }
  },
});
