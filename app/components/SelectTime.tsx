import React, { useEffect, useState } from 'react';
import { Button, Typography, CircularProgress, Alert, AlertTitle } from '@mui/material';
import api from '../api/config';

const SelectTime = ({ service, date, onSelect, onNext, onBack }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `api/v1/appointment/available-time-slots/?service_id=${service.id}&date=${date}`
        );
        setAvailableSlots(response.data.available_slots);
      } catch (error) {
        const message = error.response?.data?.message || "Failed to load available time slots";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableTimeSlots();
  }, [service, date]);

  return (
    <div>
      <Typography variant="h6">Select a Time</Typography>
      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      {availableSlots.length === 0 && !loading && !error && (
        <Alert severity="info">
          <AlertTitle>No Available Slots</AlertTitle>
          There are no available time slots for the selected date.
        </Alert>
      )}
      {availableSlots.map((slot) => (
        <Button 
          key={slot} 
          onClick={() => { onSelect(slot); onNext(); }}
          disabled={loading}
        >
          {slot}
        </Button>
      ))}
      <Button onClick={onBack} disabled={loading}>Back</Button>
    </div>
  );
};

export default SelectTime; 