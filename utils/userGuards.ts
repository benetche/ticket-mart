import { IronSessionData } from 'iron-session';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { redirectToFrom, routes, VisitorType } from './routes';
import { withSessionSsr } from './withSession';

export interface BasicUserInfoSSR {
  user: IronSessionData['user'] | { type: string };
}

export function withUserGuard<P>(
  handler?: (
    context: GetServerSidePropsContext
  ) =>
    | GetServerSidePropsResult<P & { [key: string]: unknown }>
    | Promise<GetServerSidePropsResult<P & { [key: string]: unknown }>>
) {
  return withSessionSsr<
    ((P & BasicUserInfoSSR) | BasicUserInfoSSR) & { [key: string]: unknown }
  >(async (context) => {
    const user = context.req.session.user ?? {
      type: 'guest',
    };

    const currRoute = routes[context.resolvedUrl];

    if (currRoute !== undefined) {
      const { validUserTypes } = currRoute;
      const { type } = user;
      if (validUserTypes !== 'all') {
        if (!validUserTypes.includes(type as VisitorType)) {
          return {
            redirect: {
              destination: redirectToFrom(context.resolvedUrl),
              permanent: false,
            },
          };
        }
      }
    } else {
      console.warn(`Using non defined route: ${context.resolvedUrl}`);
    }

    if (handler !== undefined) {
      const result = await handler(context);

      if ('props' in result) {
        return {
          props: {
            user,
            ...result.props,
          },
        };
      }
      return result;
    }
    return {
      props: {
        user,
      },
    };
  });
}
