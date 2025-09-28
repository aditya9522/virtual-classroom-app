import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Box, Typography, Stack } from '@mui/material';
import ClassCard from '../../components/class/ClassCard';
import { fetchClassesThunk } from '../../features/classes/classesThunks';

const Dashboard = () => {
  const classes = useSelector((state: RootState) => state.classes.classes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClassesThunk() as any);
  }, [dispatch]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Student Dashboard
      </Typography>

      <Stack direction="row" flexWrap="wrap" spacing={3}>
        {classes.map((cls) => (
          <Box key={cls.id} sx={{ flex: '1 1 calc(33.33% - 16px)', minWidth: 250 }}>
            <ClassCard classData={cls} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Dashboard;
