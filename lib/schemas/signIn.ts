import z from 'zod';

export const signInSchema = z.object({
  email: z.email({ message: '올바른 이메일 형식을 입력해주세요' }).min(1, { message: '이메일을 입력해주세요' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 최소 8글자 이상이어야 합니다' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다',
    }),
});

export type SignInFormData = z.infer<typeof signInSchema>;
