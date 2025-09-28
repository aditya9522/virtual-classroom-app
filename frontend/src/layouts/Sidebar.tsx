import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 280;
const navbarHeight = 64;

const Sidebar = ({ open }: { open: boolean }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 0,
          boxSizing: 'border-box',
          mt: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`,
          transition: 'width 0.3s',
        },
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate(`/${user?.role}`)}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {user?.role === 'admin' && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/admin/users')}>
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText primary="Manage Users" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/admin/classes')}>
                <ListItemIcon><BookIcon /></ListItemIcon>
                <ListItemText primary="Manage Classes" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(user.role === 'admin' ? '/admin/classes/create' : '/classes/create')}>
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