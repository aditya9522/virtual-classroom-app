import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 280;
const navbarHeight = 64;

const Sidebar = ({ open }: { open: boolean; sx?: any }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`,
          transition: 'width 0.3s',
        },
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/classes/create')}>
              <ListItemIcon><ClassIcon /></ListItemIcon>
              <ListItemText primary="Create Class" />
            </ListItemButton>
          </ListItem>
        )}

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/profile')}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        
      </List>
    </Drawer>
  );
};

export default Sidebar;
