import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

const SuccessPayment: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/authenticated');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Payment Successful
      </Typography>
      <Typography variant="body1" gutterBottom>
        Your payment was processed successfully. Thank you for your purchase!
      </Typography>
      <Button variant="contained" color="primary" onClick={handleBackToHome}>
        Back to Home
      </Button>
    </Container>
  );
};

export default SuccessPayment; 