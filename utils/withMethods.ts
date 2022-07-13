import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from './withSession';

export type HttpMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH';

export type MethodsHandlers = {
  [method in HttpMethod]?: NextApiHandler;
};

export function withMethodsRoute(handlers: MethodsHandlers) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== undefined) {
      const method = req.method as HttpMethod;
      const handler = handlers[method];
      if (handler !== undefined) {
        return handler(req, res);
      }
    }

    res.setHeader('Allow', Object.keys(handlers));
    res.status(405).end(`Method ${req.method} Not Allowed`);
  };
}

export function withMethodsAndSessionRoute(
  handlers: MethodsHandlers
): NextApiHandler {
  return withSessionRoute(withMethodsRoute(handlers));
}
