import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const navbarHeight = 64;

const ProtectedLayout = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => setOpen(!open);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <CssBaseline />

      <Navbar onDrawerToggle={handleDrawerToggle} drawerOpen={open} />

      <Sidebar open={open} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${navbarHeight}px`,
          minHeight: `calc(100vh - ${navbarHeight}px)`,
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedLayout;