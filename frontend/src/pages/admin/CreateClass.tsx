import { useEffect, useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClassForm from '../../components/class/ClassForm';
import { createClassThunk } from '../../features/classes/classesThunks';
import type { ClassCreate, UserResponse } from '../../types/api';
import { getAllUsers } from '../../services/api';

const CreateClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<UserResponse[]>([]);

  useEffect(() => {
    getAllUsers().then((data) => setTeachers(data.filter((u) => u.role === 'teacher')));
  }, []);

  const handleSubmit = (data: ClassCreate) => {
    dispatch(createClassThunk(data) as any);
    navigate('/admin');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Create New Class
        </Typography>
        <ClassForm onSubmit={handleSubmit} isAdmin teachers={teachers} />
      </Paper>
    </Container>
  );
};

export default CreateClass;