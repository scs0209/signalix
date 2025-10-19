'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FooterLink from '@/components/forms/FooterLink';
import InputField from '@/components/forms/InputField';
import { Button } from '@/components/ui/button';
import { signInWithEmail } from '@/lib/actions/auth.actions';
import { type SignInFormData, signInSchema } from '@/lib/schemas/signIn';

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) {
        toast.success('로그인이 완료되었습니다!');
        router.push('/');
      } else {
        toast.error('로그인에 실패했습니다', {
          description: result.error || '로그인에 실패했습니다.',
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Sign in failed', {
        description: e instanceof Error ? e.message : 'Failed to sign in.',
      });
    }
  };

  return (
    <>
      <h1 className='form-title'>Welcome back</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <InputField
          name='email'
          label='Email'
          placeholder='contact@jsmastery.com'
          register={register}
          error={errors.email}
        />

        <InputField
          name='password'
          label='Password'
          placeholder='Enter your password'
          type='password'
          register={register}
          error={errors.password}
        />

        <Button type='submit' disabled={isSubmitting} className='yellow-btn w-full mt-5'>
          {isSubmitting ? 'Signing In' : 'Sign In'}
        </Button>

        <FooterLink text="Don't have an account?" linkText='Create an account' href='/sign-up' />
      </form>
    </>
  );
};
export default SignIn;
