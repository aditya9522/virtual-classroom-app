import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';
import type { ClassCreate } from '../../types/api';

const schema = yup.object({
  title: yup.string().required(),
  description: yup.string().nullable().optional(),
  scheduled_at: yup.string().nullable().optional(),
}) as yup.ObjectSchema<ClassCreate>;

interface ClassFormProps {
  onSubmit: (data: ClassCreate) => void;
  defaultValues?: ClassCreate;
}

const ClassForm = ({ onSubmit, defaultValues }: ClassFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ClassCreate>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField label="Title" fullWidth margin="normal" {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
      <TextField label="Description" fullWidth margin="normal" multiline {...register('description')} error={!!errors.description} helperText={errors.description?.message} />
      <TextField label="Scheduled At (ISO)" fullWidth margin="normal" {...register('scheduled_at')} error={!!errors.scheduled_at} helperText={errors.scheduled_at?.message} />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Submit
      </Button>
    </form>
  );
};

export default ClassForm;