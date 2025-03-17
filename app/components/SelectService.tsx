import React, { useEffect, useState } from 'react';
import api from '../api/config';
import { Button, Typography, CircularProgress, Alert, AlertTitle } from '@mui/material';

const SelectService = ({ onSelect, onNext }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await api.get('api/v1/services/');
        setServices(response.data);
      } catch (error) {
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div>
      <Typography variant="h6">Select a Service</Typography>
      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      {services.map((service) => (
        <Button 
          key={service.id} 
          onClick={() => { onSelect(service); onNext(); }}
          disabled={loading}
        >
          {service.name}
        </Button>
      ))}
    </div>
  );
};

export default SelectService;