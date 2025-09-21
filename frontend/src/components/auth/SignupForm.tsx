import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useDispatch } from 'react-redux';
import { signupThunk } from '../../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';
import type { UserCreate } from '../../types/api';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  full_name: yup.string().nullable().optional(),
  role: yup.string().oneOf(['student', 'teacher', 'admin']).required(),
}) as yup.ObjectSchema<UserCreate>;

const SignupForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserCreate>({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: UserCreate) => {
    dispatch(signupThunk(data) as any);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField label="Email" fullWidth margin="normal" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
      <TextField label="Password" type="password" fullWidth margin="normal" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
      <TextField label="Full Name" fullWidth margin="normal" {...register('full_name')} error={!!errors.full_name} helperText={errors.full_name?.message} />
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select {...register('role')} defaultValue="student">
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Signup
      </Button>
    </form>
  );
};

export default SignupForm;