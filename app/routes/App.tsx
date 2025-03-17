import { useState, useEffect } from 'react'
import { Container, Typography, Box, TextField, Button, Paper, Tab, Tabs, CircularProgress } from '@mui/material'
import api, { fetchCSRFToken } from '../api/config'
import { Google, GitHub, Facebook } from '@mui/icons-material'
import useUserData from '../hooks/useUserData'
import { isAuthenticated } from '~/api/authService';
import { Navigate } from 'react-router'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [redirect, setRedirect] = useState(false); 
  
  const { userData, error: userDataError, refetch } = useUserData();

  const checkAuth = async () => {
    if (await isAuthenticated()) {
      setRedirect(true);
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
        // Fetch user data on initial load
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
      setRedirect(true);
    }
  }, [userData]);


  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
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
      const response = await api.post('api/v1/login', loginData);
      // Fetch user data after successful login
      await refetch();
      setResponse(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized) {
      setError('Application not fully initialized. Please wait...');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('api/v1/register', registerData);
      setResponse(response.data);

    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    try {
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/auth/${provider}/redirect`;
    } catch (error) {
      console.error('Social login redirect error:', error);
      setError('Failed to redirect to social login');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'success') {
      refetch();
    } else if (params.get('error')) {
      console.error('Social login error:', params.get('error'));
      setError(`Social login failed: ${params.get('error')}`);
    }
  }, []);


  if (redirect) return <Navigate to="/authenticated" replace />;

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Auth API Testing Interface
        </Typography>

          <Paper sx={{ width: '100%', mt: 3 }}>
            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            <TabPanel value={tab} index={0}>
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
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography align="center" variant="body2" sx={{ mb: 2 }}>
                    Or continue with
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Google />}
                      onClick={() => handleSocialLogin('google')}
                    >
                      Google
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<GitHub />}
                      onClick={() => handleSocialLogin('github')}
                    >
                      GitHub
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<Facebook />}
                      onClick={() => handleSocialLogin('facebook')}
                    >
                      Facebook
                    </Button>
                  </Box>
                </Box>
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
            </TabPanel>

            <TabPanel value={tab} index={1}>
              <form onSubmit={handleRegister}>
                <TextField
                  fullWidth
                  label="Name"
                  margin="normal"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
                                <TextField
                  fullWidth
                  label="Middle Name"
                  margin="normal"
                  value={registerData.middle_name}
                  onChange={(e) => setRegisterData({ ...registerData, middle_name: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  value={registerData.last_name}
                  onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  margin="normal"
                  value={registerData.password_confirmation}
                  onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                  required
                />
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Register'}
                </Button>
              </form>
            </TabPanel>
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

export default App
