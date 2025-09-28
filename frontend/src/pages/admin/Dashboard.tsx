import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Button } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClassIcon from '@mui/icons-material/Class';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getAllUsers, getClasses } from '../../services/api';
import type { UserResponse, ClassResponse } from '../../types/api';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 2,
      flex: 1,
      minWidth: 150,
      textAlign: 'center',
      bgcolor: '#ffffff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    }}
  >
    <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
    <Typography variant="h4" fontWeight={600} color="text.primary">
      {value}
    </Typography>
    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
      {title}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await getAllUsers();
        setUsers(userData);
        const classesData = await getClasses();
        setClasses(classesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalUsers = users.length;
  const totalTeachers = users.filter((u) => u.role === 'teacher').length;
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalClasses = classes.length;
  const activeClasses = classes.filter((c) => c.scheduled_at && new Date(c.scheduled_at) > new Date()).length;

  const userData = [
    { name: 'Admins', value: users.filter((u) => u.role === 'admin').length },
    { name: 'Teachers', value: totalTeachers },
    { name: 'Students', value: totalStudents },
  ];

  const recentClasses = classes
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, 5);

  return (
    <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={600} color="primary" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      <Stack spacing={4}>
        <Stack direction="row" spacing={3}>
          <StatCard title="Total Users" value={totalUsers} icon={<GroupIcon fontSize="large" />} />
          <StatCard title="Teachers" value={totalTeachers} icon={<SchoolIcon fontSize="large" />} />
          <StatCard title="Students" value={totalStudents} icon={<GroupIcon fontSize="large" />} />
          <StatCard title="Total Classes" value={totalClasses} icon={<ClassIcon fontSize="large" />} />
          <StatCard title="Active Classes" value={activeClasses} icon={<ClassIcon fontSize="large" />} />
        </Stack>

        <Stack direction="row" spacing={3}>
          <Box flex={1}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
                User Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={userData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {userData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          <Box flex={1}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
                Recent Classes
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Teacher</TableCell>
                      <TableCell>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>{cls.title}</TableCell>
                        <TableCell>{users.find((u) => u.id === cls.teacher_id)?.full_name || 'Unknown'}</TableCell>
                        <TableCell>{new Date(cls.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Stack>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 2,
            bgcolor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            variant="h6"
            fontWeight={500}
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Quick Actions
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<ManageAccountsIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
              onClick={() => navigate('/admin/users')}
            >
              Manage Users
            </Button>

            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<AddCircleIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
              onClick={() => navigate('/admin/classes/create')}
            >
              Create Class
            </Button>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<ClassIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
              onClick={() => navigate('/admin/classes')}
            >
              Manage Classes
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Dashboard;