import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, CircularProgress, Alert, AlertTitle } from '@mui/material';
import api from '../api/config';

const SelectDentist = ({ service, date, time, onSelect, onSubmit, onBack }) => {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDentist, setSelectedDentist] = useState(null);

  useEffect(() => {
    const fetchAvailableDentists = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `api/v1/appointment/available-dentists/?service_id=${service.id}&date=${date}&time=${time}`
        );
        setDentists(response.data.available_dentists);
      } catch (error) {
        const message = error.response?.data?.message || 
                       error.response?.data?.error || 
                       "Failed to load available dentists";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableDentists();
  }, [service, date, time]);

  const handleDentistSelect = (dentist) => {
    setSelectedDentist(dentist);
    onSelect(dentist);
  };

  return (
    <div>
      <Typography variant="h6">Select a Dentist</Typography>
      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      {dentists.length === 0 && !loading && !error && (
        <Alert severity="info">
          <AlertTitle>No Available Dentists</AlertTitle>
          There are no dentists available at the selected time.
        </Alert>
      )}
      {dentists.map((dentist) => (
        <Button 
          key={dentist.id} 
          onClick={() => handleDentistSelect(dentist)}
          variant={selectedDentist?.id === dentist.id ? "contained" : "outlined"}
          disabled={loading}
        >
          Dr. {dentist.name}
        </Button>
      ))}
      <Button onClick={onBack} disabled={loading}>Back</Button>
      <Button 
        onClick={onSubmit} 
        disabled={!selectedDentist || loading}
      >
        Next
      </Button>
    </div>
  );
};

export default SelectDentist; 