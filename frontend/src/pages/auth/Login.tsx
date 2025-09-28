import { Container, Paper, Typography } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <LoginForm />
        <Typography align="center" sx={{ mt: 2 }}>
          No account? <Link to="/signup">Signup</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;