import { useState } from 'react';
import type { MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onDrawerToggle: () => void;
  drawerOpen: boolean;
}

const Navbar = ({ onDrawerToggle }: NavbarProps) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openProfileMenu = Boolean(anchorEl);

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleProfileClose();
  };

  const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
  const openNotifMenu = Boolean(anchorNotif);

  const handleNotifClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorNotif(event.currentTarget);
  };
  const handleNotifClose = () => {
    setAnchorNotif(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onDrawerToggle} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Virtual Classroom
        </Typography>

        {user && (
          <>
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotifClick}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorNotif}
              open={openNotifMenu}
              onClose={handleNotifClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleNotifClose}>New Assignment Posted</MenuItem>
              <MenuItem onClick={handleNotifClose}>Class Reminder</MenuItem>
              <MenuItem onClick={handleNotifClose}>System Update</MenuItem>
            </Menu>

            <Tooltip title="Account settings">
              <IconButton color="inherit" onClick={handleProfileClick} sx={{ ml: 1 }}>
                <AccountCircle />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={openProfileMenu}
              onClose={handleProfileClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem>
                <Typography variant="body1" color='primary'>Account Settings</Typography>
              </MenuItem>
              <MenuItem onClick={() => { navigate('/profile'); handleProfileClose(); }}>
                Profile
              </MenuItem>
              {user.role === 'admin' && (
                <MenuItem onClick={() => { navigate('/admin'); handleProfileClose(); }}>
                  Admin Panel
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            <Typography variant="body1" sx={{ ml: 2 }}>
              {user.email}
            </Typography>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
