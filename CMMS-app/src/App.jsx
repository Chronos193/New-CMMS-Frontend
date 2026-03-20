import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import FirstPage from './pages/FirstPage';
import DailyMenu from './pages/DailyMenu';
import ComplaintPage from "./pages/ComplaintPage";
import ProtectedRoute from './components/auth/ProtectedRoute';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        
        {/* Protected Routes */}
        <Route path="/first" element={
          <ProtectedRoute>
            <FirstPage />
          </ProtectedRoute>
        } />
        <Route path="/menu" element={
          <ProtectedRoute>
            <DailyMenu />
          </ProtectedRoute>
        } />
        <Route path="/feedbacks" element={
          <ProtectedRoute>
            <ComplaintPage />
          </ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />

        {/* Placeholder for future dashboard */}
        <Route path="/dashboard" element={
          <div className='flex justify-center items-center h-screen bg-gray-900 text-white'>
            <h1 className='text-3xl font-bold'>Welcome to Dashboard!</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;



export default App;

