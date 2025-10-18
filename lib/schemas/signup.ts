import { z } from 'zod';
import { INVESTMENT_GOALS, RISK_TOLERANCE_OPTIONS, PREFERRED_INDUSTRIES } from '@/lib/constants';

// 상수에서 값들을 추출하여 enum으로 변환
const investmentGoalValues = INVESTMENT_GOALS.map(goal => goal.value) as [string, ...string[]];
const riskToleranceValues = RISK_TOLERANCE_OPTIONS.map(option => option.value) as [string, ...string[]];
const preferredIndustryValues = PREFERRED_INDUSTRIES.map(industry => industry.value) as [string, ...string[]];

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 최소 2글자 이상이어야 합니다')
    .max(50, '이름은 50글자를 초과할 수 없습니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문, 공백만 포함할 수 있습니다'),
  
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요')
    .max(100, '이메일은 100글자를 초과할 수 없습니다'),
  
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(8, '비밀번호는 최소 8글자 이상이어야 합니다')
    .max(100, '비밀번호는 100글자를 초과할 수 없습니다')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다'
    ),
  
  country: z
    .string()
    .min(1, '국가를 선택해주세요')
    .length(2, '국가 코드는 2글자여야 합니다'),
  
  investmentGoals: z
    .enum(investmentGoalValues, {
      message: '올바른 투자 목표를 선택해주세요'
    }),
  
  riskTolerance: z
    .enum(riskToleranceValues, {
      message: '올바른 위험 감수 수준을 선택해주세요'
    }),
  
  preferredIndustry: z
    .enum(preferredIndustryValues, {
      message: '올바른 선호 산업을 선택해주세요'
    }),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
