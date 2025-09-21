import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <CircularProgress size={60} />
    <Box component="span" sx={{ fontSize: '1.2rem', color: '#555' }}>
      Loading, please wait...
    </Box>
  </Box>
);

export default LoadingSpinner;
