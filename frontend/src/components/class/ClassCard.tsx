import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ClassResponse } from '../../types/api';

const ClassCard = ({ classData }: { classData: ClassResponse }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{classData.title}</Typography>
        <Typography color="text.secondary">{classData.description}</Typography>
        <Typography variant="body2">Scheduled: {classData.scheduled_at || 'On-demand'}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(`/classes/${classData.id}`)}>
          View
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClassCard;