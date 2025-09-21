import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Box, Typography, Button, Stack } from '@mui/material';
import ClassCard from '../components/class/ClassCard';
import { fetchClassesThunk } from '../features/classes/classesThunks';
import AdminDashboard from './AdminDashboard';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const classes = useSelector((state: RootState) => state.classes.classes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchClassesThunk() as any);
  }, [dispatch]);

  if (user?.role === 'admin') return <AdminDashboard />;

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Dashboard - {user?.role}
        </Typography>

        {user?.role === 'teacher' && (
          <Box sx={{ mb: 3 }}>
            <Button variant="contained" onClick={() => navigate('/classes/create')}>
              Create Class
            </Button>
          </Box>
        )}

        <Stack direction="row" flexWrap="wrap" spacing={3}>
          {classes.map((cls) => (
            <Box key={cls.id} sx={{ flex: '1 1 calc(33.33% - 16px)', minWidth: 250 }}>
              <ClassCard classData={cls} />
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default Dashboard;
