import type { FieldError, Path, UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SignUpFormData } from '@/lib/schemas/signup';
import { cn } from '@/lib/utils';

type FormInputProps = {
  name: Path<SignUpFormData>;
  label: string;
  placeholder: string;
  type?: string;
  register: UseFormRegister<SignUpFormData>;
  error?: FieldError;
  disabled?: boolean;
  value?: string;
};

const InputField = ({ name, label, placeholder, type = 'text', register, error, disabled, value }: FormInputProps) => {
  return (
    <div className='space-y-2'>
      <Label htmlFor={name} className='form-label'>
        {label}
      </Label>
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn('form-input', { 'opacity-50 cursor-not-allowed': disabled })}
        {...register(name)}
      />
      {error && <p className='text-sm text-red-500'>{error.message}</p>}
    </div>
  );
};
export default InputField;
