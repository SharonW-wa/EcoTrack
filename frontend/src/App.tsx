import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WasteCategories from './pages/WasteCategories';
import RecyclingCenters from './pages/RecyclingCenters';
import Rewards from './pages/Rewards';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';

import AdminDashboard from './pages/admin/AdminDasboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCenters from './pages/admin/AdminCenters';
import AdminActivities from './pages/admin/AdminActivities';
import AdminFeedback from './pages/admin/AdminFeedback';

import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// User-facing pages — has Navbar and Footer
function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      {/* ── User-facing routes (with Navbar + Footer) ── */}
      <Route path="/" element={<UserLayout><Home /></UserLayout>} />
      <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
      <Route path="/register" element={<UserLayout><Register /></UserLayout>} />
      <Route path="/waste-categories" element={<UserLayout><WasteCategories /></UserLayout>} />
      <Route path="/recycling-centers" element={<UserLayout><RecyclingCenters /></UserLayout>} />
      <Route path="/dashboard" element={<UserLayout><ProtectedRoute><Dashboard /></ProtectedRoute></UserLayout>} />
      <Route path="/rewards" element={<UserLayout><ProtectedRoute><Rewards /></ProtectedRoute></UserLayout>} />
      <Route path="/feedback" element={<UserLayout><ProtectedRoute><Feedback /></ProtectedRoute></UserLayout>} />
      <Route path="/profile" element={<UserLayout><ProtectedRoute><Profile /></ProtectedRoute></UserLayout>} />

      {/* ── Admin routes (NO Navbar/Footer — AdminLayout handles its own UI) ── */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/centers" element={<AdminRoute><AdminCenters /></AdminRoute>} />
      <Route path="/admin/activities" element={<AdminRoute><AdminActivities /></AdminRoute>} />
      <Route path="/admin/feedback" element={<AdminRoute><AdminFeedback /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;