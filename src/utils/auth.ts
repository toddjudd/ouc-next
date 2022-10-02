import * as z from 'zod';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { authOptions } from '../pages/api/auth/[...nextauth]';

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      authOptions
    );

    if (!session) {
      return {
        redirect: {
          destination: '/', // login path
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
