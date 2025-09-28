import { Stack, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { ClassCreate, UserResponse } from '../../types/api';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { formatISO } from 'date-fns';

interface ClassFormProps {
  onSubmit: SubmitHandler<ClassCreate>;
  isAdmin?: boolean;
  teachers?: UserResponse[];
}

const ClassForm = ({ onSubmit, isAdmin = false, teachers = [] }: ClassFormProps) => {
  const schema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().nullable().optional(),
    scheduled_at: yup
      .string()
      .nullable()
      .optional()
      .test('is-valid-datetime', 'Scheduled At must be a valid ISO datetime', (value) => {
        if (!value) return true;
        return !isNaN(Date.parse(value));
      }),
    teacher_id: isAdmin ? yup.number().required('Teacher is required') : yup.number().nullable().optional(),
  }) as yup.ObjectSchema<ClassCreate>;

  const defaultValues: ClassCreate = {
    title: '',
    description: '',
    scheduled_at: null,
    teacher_id: undefined,
  };

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<ClassCreate>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleFormSubmit: SubmitHandler<ClassCreate> = (data) => {
    const cleanedData = {
      ...data,
      scheduled_at: data.scheduled_at === '' || data.scheduled_at === null ? null : data.scheduled_at,
      description: data.description === '' ? null : data.description,
    };
    onSubmit(cleanedData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={3}>
          <TextField
            label="Title"
            fullWidth
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <DateTimePicker
            label="Scheduled At"
            onChange={(newValue) => {
              setValue('scheduled_at', newValue ? formatISO(newValue, { representation: 'complete' }) : null);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.scheduled_at,
                helperText: errors.scheduled_at?.message || 'Select a date and time (optional)',
              },
            }}
          />
          {isAdmin && (
            <FormControl fullWidth error={!!errors.teacher_id}>
              <InputLabel>Assign Teacher</InputLabel>
              <Select {...register('teacher_id', { valueAsNumber: true })}>
                {teachers.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.full_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.teacher_id && <Typography color="error" variant="caption">{errors.teacher_id.message}</Typography>}
            </FormControl>
          )}
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 2 }}>
            {isSubmitting ? 'Creating...' : 'Create Class'}
          </Button>
        </Stack>
      </form>
    </LocalizationProvider>
  );
};

export default ClassForm;