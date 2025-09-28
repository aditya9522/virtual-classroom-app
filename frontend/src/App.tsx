import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/auth/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminClasses from './pages/admin/Classes';
import AdminCreateClass from './pages/admin/CreateClass';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherCreateClass from './pages/teacher/CreateClass';
import StudentDashboard from './pages/student/Dashboard';
import ClassDetail from './pages/shared/ClassDetail';
import Profile from './pages/shared/Profile';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

const theme = createTheme();

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/loader" element={<LoadingSpinner />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/classes" element={<AdminClasses />} />
              <Route path="/admin/classes/create" element={<AdminCreateClass />} />

              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/classes/create" element={<TeacherCreateClass />} />

              <Route path="/student" element={<StudentDashboard />} />

              <Route path="/classes/:classId" element={<ClassDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </ThemeProvider>
    </Provider>
  );
};

export default App;