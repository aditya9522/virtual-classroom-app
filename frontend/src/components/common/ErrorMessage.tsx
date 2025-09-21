import { Alert } from '@mui/material';

const ErrorMessage = ({ message }: { message: string }) => (
  <Alert severity="error" sx={{ mt: 2 }}>
    {message}
  </Alert>
);

export default ErrorMessage;