import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

const FailedPayment: React.FC = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate('/authenticated');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Payment Failed
      </Typography>
      <Typography variant="body1" gutterBottom>
        Unfortunately, your payment could not be processed. Please try again.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRetryPayment}>
        Retry Payment
      </Button>
    </Container>
  );
};

export default FailedPayment; 