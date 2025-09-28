import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Paper, Typography, TextField, Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/api';
import { setUser } from '../../features/auth/AuthSlice';
import { toast } from 'react-toastify';

interface ProfileForm {
  full_name?: string | null;
  password?: string;
}

const schema = yup.object({
  full_name: yup.string().nullable().optional(),
  password: yup.string().min(6, 'Password must be at least 6 characters').nullable().optional(),
}) as yup.ObjectSchema<ProfileForm>;

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: yupResolver(schema),
    defaultValues: { full_name: user?.full_name || '', password: '' },
  });

  useEffect(() => {
    reset({ full_name: user?.full_name || '', password: '' });
  }, [user, reset]);

  const onSubmit: SubmitHandler<ProfileForm> = async (data) => {
    try {
      const payload = { full_name: data.full_name, ...(data.password ? { password: data.password } : {}) };
      const updatedUser = await updateProfile(payload);
      dispatch(setUser(updatedUser));
      toast.success('Profile updated successfully!');
      reset({ full_name: updatedUser.full_name || '', password: '' });
    } catch (err) {
      toast.error('Failed to update profile.');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              value={user?.email}
              fullWidth
              disabled
            />
            <TextField
              label="Full Name"
              fullWidth
              {...register('full_name')}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message || 'Leave empty if not changing password'}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;