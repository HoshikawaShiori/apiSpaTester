import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import api from '../api/config';

const SelectTime = ({ service, date, onSelect, onNext, onBack }) => {
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      const response = await api.get(`api/v1/appointment/available-time-slots/?service_id=${service.id}&date=${date}`);
      setAvailableSlots(response.data.available_slots);
    };
    fetchAvailableTimeSlots();
  }, [service, date]);

  return (
    <div>
      <Typography variant="h6">Select a Time</Typography>
      {availableSlots.map((slot) => (
        <Button key={slot} onClick={() => { onSelect(slot); onNext(); }}>
          {slot}
        </Button>
      ))}
      <Button onClick={onBack}>Back</Button>
    </div>
  );
};

export default SelectTime; 