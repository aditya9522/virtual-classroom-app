import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const drawerWidth = 280;
const navbarHeight = 64;

const ProtectedLayout = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => setOpen(!open);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <CssBaseline />

      {/* Navbar */}
      <Navbar onDrawerToggle={handleDrawerToggle} drawerOpen={open} />

      {/* Sidebar */}
      <Sidebar
        open={open}
        sx={{
          mt: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`,
        }}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${navbarHeight}px`,
          ml: open ? 0 : `-${drawerWidth}px`,
          transition: 'margin 0.3s ease',
          minHeight: `calc(100vh - ${navbarHeight}px)`,
          width: '100%',
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
