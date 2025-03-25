import { useState, useEffect } from 'react'
import { Container, Typography, Box, TextField, Button, Paper, CircularProgress } from '@mui/material'
import api, { fetchCSRFToken } from '../api/config'
import useUserData from '../hooks/useUserData'
import { isAuthenticated, getUserRole } from '~/api/authService';
import { Navigate } from 'react-router'

function StaffAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [roleRedirect, setRoleRedirect] = useState<string | null>(null);
  
  const { userData, error: userDataError, refetch } = useUserData();

  const checkAuth = async () => {
    if (await isAuthenticated()) {
      const role = await getUserRole();
      switch (role) {
        case 'admin':
          setRoleRedirect('/admin');
          break;
        case 'dentist':
          setRoleRedirect('/dentist');
          break;
        default:
          setRoleRedirect('/');
          break;
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  
  useEffect(() => {
    const initializeCSRF = async () => {
      try {
        await fetchCSRFToken();
        setIsInitialized(true);
        await refetch();
      } catch (error) {
        console.error('Failed to initialize CSRF token:', error);
        setError('Failed to initialize application. Please refresh the page.');
      }
    };
    initializeCSRF();
  }, []);

  useEffect(() => {
    if (userData) {
      const role = userData.role;
      switch (role) {
        case 'admin':
          setRoleRedirect('/admin');
          break;
        case 'dentist':
          setRoleRedirect('/dentist');
          break;
        default:
          setRoleRedirect('/');
          break;
      }
    }
  }, [userData]);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized) {
      setError('Application not fully initialized. Please wait...');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('api/v1/staff/login', loginData);
      await refetch();
      setResponse(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  if (roleRedirect) {
    return <Navigate to={roleRedirect} replace />;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Staff Login
        </Typography>

        <Paper sx={{ p: 3, width: '100%', mt: 3 }}>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
        </Paper>

        {error && (
          <Paper sx={{ mt: 3, p: 2, bgcolor: '#ffebee' }}>
            <Typography color="error">
              Error: {error}
            </Typography>
          </Paper>
        )}

        {response && (
          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6">Response:</Typography>
            <pre style={{ overflow: 'auto', background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          </Paper>
        )}
      </Box>
    </Container>
  )
}

export default StaffAuth
