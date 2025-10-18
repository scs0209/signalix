'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CountrySelectField } from '@/components/forms/CountrySelectField';
import FooterLink from '@/components/forms/FooterLink';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import { Button } from '@/components/ui/button';
// import { signUpWithEmail } from '@/lib/actions/auth.actions';
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants';
import { type SignUpFormData, signUpSchema } from '@/lib/schemas/signup';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log('Form data:', data);
      // const result = await signUpWithEmail(data);
      // if (result.success) router.push('/');
      toast.success('회원가입이 완료되었습니다!');
    } catch (e) {
      console.error(e);
      toast.error('회원가입에 실패했습니다', {
        description: e instanceof Error ? e.message : '계정 생성에 실패했습니다.',
      });
    }
  };

  return (
    <>
      <h1 className='form-title'>Sign Up & Personalize</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <InputField
          name='fullName'
          label='Full Name'
          placeholder='John Doe'
          register={register}
          error={errors.fullName}
        />

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
          placeholder='Enter a strong password'
          type='password'
          register={register}
          error={errors.password}
        />

        <CountrySelectField name='country' label='Country' control={control} error={errors.country} />

        <SelectField
          name='investmentGoals'
          label='Investment Goals'
          placeholder='Select your investment goal'
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
        />

        <SelectField
          name='riskTolerance'
          label='Risk Tolerance'
          placeholder='Select your risk level'
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
        />

        <SelectField
          name='preferredIndustry'
          label='Preferred Industry'
          placeholder='Select your preferred industry'
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
        />

        <Button type='submit' disabled={isSubmitting} className='yellow-btn w-full mt-5'>
          {isSubmitting ? 'Creating Account' : 'Start Your Investing Journey'}
        </Button>

        <FooterLink text='Already have an account?' linkText='Sign in' href='/sign-in' />
      </form>
    </>
  );
};
export default SignUp;
