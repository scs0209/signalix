import { type Control, Controller, type FieldError, type FieldValues, type Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder: string;
  options: readonly Option[];
  control: Control<T>;
  error?: FieldError;
};

const SelectField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  options,
  control,
  error,
}: SelectFieldProps<T>) => {
  return (
    <div className='space-y-2'>
      <Label htmlFor={name} className='form-label'>
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Select value={field.value as string} onValueChange={field.onChange}>
              <SelectTrigger className='select-trigger'>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className='bg-gray-800 border-gray-600 text-white'>
                {options.map((option) => (
                  <SelectItem value={option.value} key={option.value} className='focus:bg-gray-600 focus:text-white'>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className='text-sm text-red-500'>{error.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default SelectField;
