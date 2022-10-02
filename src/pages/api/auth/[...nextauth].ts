import NextAuth, { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInSchema } from '../../../utils/auth';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Email',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const creds = await signInSchema.parseAsync(credentials);
        const user = await prisma.user.findUnique({
          where: {
            email: creds.email,
          },
        });

        if (!user) {
          throw new Error('No user found');
        }

        const isValid = true; // await verify(user.password, creds.password);
        // If no error and we have user data, return it
        if (user) {
          return user;
        }

        if (!isValid) {
          return null;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
        };
      }

      return token;
    },

    session: async ({ session, token }) => {
      console.log('session', session);
      console.log('token', token);
      if (token) {
        session.id = token.id;
      }

      return session;
    },
  },
  theme: {
    colorScheme: 'dark', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code #33FF5D
    logo: '/logo.png', // Absolute URL to image
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
