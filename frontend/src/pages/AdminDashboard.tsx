import { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { getAllUsers } from '../services/api';
import type { UserResponse } from '../types/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getAllUsers();
      setUsers(userData);
    };
    fetchData();
  }, []);

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4">Admin Dashboard</Typography>
        </Box>

        {/* Users Table */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Manage Users
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.full_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Button variant="outlined">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;
