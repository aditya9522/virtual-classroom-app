import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import type { UserResponse } from '../../types/api';
import { getAllUsers } from '../../services/api'; // Placeholder API

const UserManagement = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users', err);
        // Placeholder mock data if API not available
        setUsers([
          { id: 1, email: 'admin@example.com', full_name: 'Admin', role: 'admin', created_at: '2023-01-01', token: '', token_type: 'bearer' },
        ]);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Button variant="outlined">Edit</Button> {/* Implement if PATCH API available */}
              <Button variant="outlined" color="error">Delete</Button> {/* Implement if DELETE API available */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserManagement;