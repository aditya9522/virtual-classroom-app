import { Container, Paper, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClassForm from '../../components/class/ClassForm';
import { createClassThunk } from '../../features/classes/classesThunks';
import type { ClassCreate } from '../../types/api';
import { useAuth } from '../../hooks/useAuth';

const CreateClass = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (data: ClassCreate) => {
    dispatch(createClassThunk({ ...data, teacher_id: user?.id }) as any);
    navigate('/teacher');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Create New Class
        </Typography>
        <ClassForm onSubmit={handleSubmit} />
      </Paper>
    </Container>
  );
};

export default CreateClass;