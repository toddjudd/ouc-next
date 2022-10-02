import { createNextApiHandler } from '@trpc/server/adapters/next';
import { hash } from 'argon2';
import { signUpSchema } from '../../utils/auth';
import { prisma } from '../db/client';
import { createRouter } from './context';

export const userRouter = createRouter().mutation('signUp', {
  input: signUpSchema,
  resolve: async ({ input }) => {
    const { email, password } = input;
    if (!email || !password) {
      throw new Error('Missing credentials');
    }
    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (exists) {
      throw new Error('User already exists');
    }
    const hashedPassword = await hash(password);

    const result = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
      },
    });
    return { status: 201, message: 'User created', result: result };
  },
});
