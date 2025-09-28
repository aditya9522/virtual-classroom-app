import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { deleteClass, getClasses, getAllUsers } from '../../services/api';
import type { ClassResponse, UserResponse } from '../../types/api';
import { toast } from 'react-toastify';
import ConfirmDeleteDialog from '../../components/common/ConfirmDeleteDialog';

const Classes = () => {
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassResponse | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const classesData = await getClasses();
      setClasses(classesData);
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (cls: ClassResponse) => {
    setSelectedClass(cls);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedClass) return;
    try {
      await deleteClass(selectedClass.id);
      toast.success(`${selectedClass.title} deleted successfully.`);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete class.');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedClass(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" fontWeight={600} color="primary">
          Class Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Loading classes...
            </Typography>
          </Box>
        ) : classes.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="body1">No classes found.</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow
                    key={cls.id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>{cls.id}</TableCell>
                    <TableCell>{cls.title}</TableCell>
                    <TableCell>{cls.description}</TableCell>
                    <TableCell>{users.find((u) => u.id === cls.teacher_id)?.full_name || 'Unknown'}</TableCell>
                    <TableCell>{new Date(cls.created_at).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(cls)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Class"
        description={`Are you sure you want to delete ${
          selectedClass?.title || 'this class'
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>
  );
};

export default Classes;