import type { NextApiRequest, NextApiResponse } from 'next';
import { withMethodsAndSessionRoute } from '../../../utils/withMethods';

export default withMethodsAndSessionRoute({
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.status(200).end();
  },
});
