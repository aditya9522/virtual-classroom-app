import { Container, Paper, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClassForm from '../components/class/ClassForm';
import { createClassThunk } from '../features/classes/classesThunks';
import type { ClassCreate } from '../types/api';

const CreateClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (data: ClassCreate) => {
    dispatch(createClassThunk(data) as any);
    navigate('/');
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create New Class
          </Typography>
          <ClassForm onSubmit={handleSubmit} />
        </Paper>
      </Container>
    </>
  );
};

export default CreateClass;