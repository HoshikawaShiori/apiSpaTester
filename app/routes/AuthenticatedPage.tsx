import React, { useEffect, useState } from 'react';
import { CircularProgress, Button, Container, Paper, Typography, Box, Divider } from '@mui/material';
import useUserData from '../hooks/useUserData';
import { isAuthenticated, getUserRole } from '~/api/authService';
import { Navigate, Link } from 'react-router';
import api from '../api/config';
import Booking from '~/components/Booking';
import AppointmentList from '~/components/AppointmentList';

const AuthenticatedPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [redirect, setRedirect] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { userData } = useUserData();

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          // Redirect to auth page if not authenticated
          setRedirect(true);
          return;
        }
        
        const role = await getUserRole();
        setUserRole(role);
        setLoading(false);
      } catch (err) {
        setError('Failed to authenticate user');
        setLoading(false);
      }
    };
    checkAuthAndRole();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.post('api/v1/logout');
      setRedirect(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  // Redirect to auth page if not authenticated
  if (redirect) {
    return <Navigate to="/auth" />;
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {userData?.name}!
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        ) : (
          <Box>
            {/* User Profile Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Account Information</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography><strong>Name:</strong> {userData?.name} {userData?.middle_name} {userData?.last_name}</Typography>
                <Typography><strong>Email:</strong> {userData?.email}</Typography>
                <Typography><strong>Role:</strong> {userRole || 'Regular User'}</Typography>
              </Box>
              
              {/* Role-specific Quick Links */}
              {userRole != 'user' &&  (
                <Box sx={{ my: 2 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Quick Links</Typography>
                  {userRole === 'admin' && (
                    <Button
                      component={Link}
                      to="/admin"
                      variant="contained"
                      color="primary"
                      sx={{ mr: 2 }}
                    >
                      Go to Admin Dashboard
                    </Button>
                  )}
                  {userRole === 'dentist' && (
                    <Button
                      component={Link}
                      to="/dentist"
                      variant="contained"
                      color="primary"
                      sx={{ mr: 2 }}
                    >
                      Go to Dentist Dashboard
                    </Button>
                  )}
                </Box>
              )}

              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Logout'}
              </Button>
            </Paper>

            {/* Appointments Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Your Booked Appointments</Typography>
              <AppointmentList refetchTrigger={refetchTrigger} />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Book New Appointment</Typography>
                <Booking onBookingSuccess={handleBookingSuccess} />
              </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AuthenticatedPage;