import { IronSessionData } from 'iron-session';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getCurrentRoute, redirectToFrom, VisitorType } from './routes';
import { withSessionSsr } from './withSession';
import url from 'url';

export type BasicUserInfoSSR = Partial<IronSessionData['user']> & {
  type: string;
};

export function withUserGuard<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler?: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withSessionSsr<P & BasicUserInfoSSR>(async (context) => {
    const user = context.req.session.user ?? {
      type: 'guest',
    };

    const pureUrl =
      url.parse(context.resolvedUrl).pathname ?? context.resolvedUrl;

    const currRoute = getCurrentRoute(pureUrl);

    if (currRoute !== undefined) {
      const { validUserTypes } = currRoute;
      const { type } = user;
      if (validUserTypes !== 'all') {
        if (!validUserTypes.includes(type as VisitorType)) {
          return {
            redirect: {
              destination: redirectToFrom(pureUrl, true),
              permanent: false,
            },
          };
        }
      }
    }

    if (handler !== undefined) {
      const result = await handler(context);

      if ('props' in result) {
        return {
          props: {
            user,
            ...result.props,
          } as unknown as P & BasicUserInfoSSR,
        };
      }
      return result;
    }
    return {
      props: {
        user,
      } as unknown as P & BasicUserInfoSSR,
    };
  });
}
