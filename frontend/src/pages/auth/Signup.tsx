import { Container, Paper, Typography } from '@mui/material';
import SignupForm from '../../components/auth/SignupForm';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Signup
        </Typography>
        <SignupForm />
        <Typography align="center" sx={{ mt: 2 }}>
          Have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signup;
