import React, { useEffect, useState } from 'react';
import { CircularProgress, Button, Container, Paper, Typography } from '@mui/material';
import useUserData from '../hooks/useUserData'; // Import the custom hook
import { isAuthenticated } from '~/api/authService';
import { Navigate } from 'react-router';
import api from '../api/config';
import Booking from '~/components/Booking';

const AuthenticatedPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [redirect, setRedirect] = useState(false); 

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

          <Paper sx={{ p: 2, mb: 3 }}>
            <Booking/>
            </Paper>
          
        </Paper>
      ) : (
        <Typography variant="body1">
          Loading user data...
        </Typography>
      )}
    </Container>
  );
};

export default AuthenticatedPage;