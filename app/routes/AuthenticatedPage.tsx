import React, { useEffect, useState, useCallback } from 'react';
import { CircularProgress, Button, Container, Paper, Typography, Box } from '@mui/material';
import useUserData from '../hooks/useUserData'; // Import the custom hook
import { isAuthenticated } from '~/api/authService';
import { Navigate } from 'react-router';
import api from '../api/config';
import Booking from '~/components/Booking';
import AppointmentList from '~/components/AppointmentList';
import AllAppointments from '~/components/AllAppointments';

const AuthenticatedPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [redirect, setRedirect] = useState(false); 
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const { userData } = useUserData();

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        setRedirect(true); 
      } else {
        setLoading(false); 
      }
    };
    checkAuthentication();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.post('api/v1/logout');
      setResponse(null);
      setRedirect(true); // Redirect after logout
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    setRefetchTrigger(prev => prev + 1); // Increment trigger to cause refetch
  };

  // Redirect if not authenticated
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Authenticated Page
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : userData ? (
        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Logged in User:</Typography>
            <pre style={{ overflow: 'auto', background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
              {JSON.stringify(userData, null, 2)}
            </pre>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Logout'}
            </Button>
          </Paper>

          {/* Appointments List */}
          <AppointmentList refetchTrigger={refetchTrigger} />

          {/*Appointments List for all users */}
          <AllAppointments refetchTrigger={refetchTrigger} />

          {/* Booking Form */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Book New Appointment</Typography>
            <Booking onBookingSuccess={handleBookingSuccess} />
          </Paper>
        </Box>
      ) : (
        <Typography variant="body1">
          Loading user data...
        </Typography>
      )}
    </Container>
  );
};

export default AuthenticatedPage;