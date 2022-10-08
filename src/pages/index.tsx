import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import { SignIn, signInSchema } from '../utils/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { signIn, useSession } from 'next-auth/react';

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const session = useSession();
  const { register, handleSubmit } = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = useCallback(async (data: SignIn) => {
    await signIn('credentials', { ...data, callbackUrl: '/dashboard' });
  }, []);

  const onInvalid = useCallback((errors: any) => {
    console.log('invalid', errors);
  }, []);

  return (
    <>
      <Head>
        <title>Ouc App</title>
        <meta name='description' content='Job Tracking' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='w-screen h-screen dark:bg-gray-900 flex justify-center items-center'>
        <button
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          onClick={() => {
            signIn();
          }}>
          Sign In
        </button>
        <button
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          onClick={() => {
            signIn();
          }}>
          Sign Up
        </button>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        {/* <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <div className='mb-6'>
            <label
              htmlFor='email'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
              Your email
            </label>
            <input
              type='email'
              id='email'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='name@flowbite.com'
              required
              {...register('email')}
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='password'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
              Your password
            </label>
            <input
              type='password'
              id='password'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              required
              {...register('password')}
            />
          </div>
          <button
            type='submit'
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            Submit
          </button>
        </form> */}
      </main>
    </>
  );
};

export default Home;
