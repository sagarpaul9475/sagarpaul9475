import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import TrainingSession from './pages/training/TrainingSession';
import ProgressTracker from './pages/progress/ProgressTracker';
import ClinicianDashboard from './pages/clinician/ClinicianDashboard';
import Profile from './pages/Profile';
import About from './pages/About';

// Training Modules
import AttentionTraining from './pages/training/modules/AttentionTraining';
import MemoryTraining from './pages/training/modules/MemoryTraining';
import ExecutiveTraining from './pages/training/modules/ExecutiveTraining';
import ProcessingTraining from './pages/training/modules/ProcessingTraining';
import VisualSpatialTraining from './pages/training/modules/VisualSpatialTraining';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                
                <Route path="/training" element={
                  <PrivateRoute>
                    <TrainingSession />
                  </PrivateRoute>
                } />
                
                <Route path="/training/attention" element={
                  <PrivateRoute>
                    <AttentionTraining />
                  </PrivateRoute>
                } />
                
                <Route path="/training/memory" element={
                  <PrivateRoute>
                    <MemoryTraining />
                  </PrivateRoute>
                } />
                
                <Route path="/training/executive" element={
                  <PrivateRoute>
                    <ExecutiveTraining />
                  </PrivateRoute>
                } />
                
                <Route path="/training/processing" element={
                  <PrivateRoute>
                    <ProcessingTraining />
                  </PrivateRoute>
                } />
                
                <Route path="/training/visual-spatial" element={
                  <PrivateRoute>
                    <VisualSpatialTraining />
                  </PrivateRoute>
                } />
                
                <Route path="/progress" element={
                  <PrivateRoute>
                    <ProgressTracker />
                  </PrivateRoute>
                } />
                
                <Route path="/clinician" element={
                  <PrivateRoute allowedRoles={['clinician', 'admin']}>
                    <ClinicianDashboard />
                  </PrivateRoute>
                } />
                
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;