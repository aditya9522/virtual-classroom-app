import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loginThunk } from '../../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest } from '../../types/api';
import { toast } from 'react-toastify';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  role: yup.string().oneOf(['student', 'teacher', 'admin']).required(),
});

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginRequest) => {
    try {
      await dispatch(loginThunk(data) as any);
      navigate('/');
      toast.success("Logged in successfully");
    } catch (err: any) {
      toast.error("Incorrect credentials");
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField label="Email" fullWidth margin="normal" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
      <TextField label="Password" type="password" fullWidth margin="normal" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select {...register('role')} defaultValue="student">
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
    </form>
  );
};

export default LoginForm;