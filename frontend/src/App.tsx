import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import AwarenessHub from './pages/AwarenessHub';
import AdminDashboard from './pages/AdminDashboard';
import ProposerDashboard from './pages/ProposerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuthStore } from './store/authStore';

// Note: Using a simple ProtectedRoute without full loader for simplicity in this example
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="awareness" element={<AwarenessHub />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="proposer" element={
            <ProtectedRoute allowedRoles={['proposer']}>
              <ProposerDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
