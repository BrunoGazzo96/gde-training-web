import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Users from './pages/admin/Users';
import UserForm from './pages/admin/UserForm';
import Routines from './pages/admin/Routines';
import RoutineForm from './pages/admin/RoutineForm';
import MyRoutines from './pages/athlete/MyRoutines';

const queryClient = new QueryClient();

function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'admin' ? '/admin/users' : '/athlete/routines'} replace />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RootRedirect />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
          <Route path="/admin/users/new" element={<ProtectedRoute role="admin"><UserForm /></ProtectedRoute>} />
          <Route path="/admin/users/:id/edit" element={<ProtectedRoute role="admin"><UserForm /></ProtectedRoute>} />
          <Route path="/admin/routines" element={<ProtectedRoute role="admin"><Routines /></ProtectedRoute>} />
          <Route path="/admin/routines/new" element={<ProtectedRoute role="admin"><RoutineForm /></ProtectedRoute>} />
          <Route path="/admin/routines/:id/edit" element={<ProtectedRoute role="admin"><RoutineForm /></ProtectedRoute>} />
          <Route path="/athlete/routines" element={<ProtectedRoute role="athlete"><MyRoutines /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}
