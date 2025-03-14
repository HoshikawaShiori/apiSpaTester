import React from 'react';
import { Button, Typography, Paper } from '@mui/material';

const AppointmentSummary = ({ service, date, time, dentist, onBack, onSubmit }) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Appointment Summary</Typography>
      <Typography variant="body1"><strong>Service:</strong> {service.name}</Typography>
      <Typography variant="body1"><strong>Date:</strong> {date}</Typography>
      <Typography variant="body1"><strong>Time:</strong> {time}</Typography>
      <Typography variant="body1"><strong>Dentist ID:</strong> {dentist.id}</Typography>
      <Typography variant="body1"><strong>Dentist Name:</strong> {dentist.name}</Typography>

      <Button variant="contained" color="primary" onClick={onSubmit} sx={{ mt: 2 }}>
        Confirm Appointment
      </Button>
      <Button variant="outlined" onClick={onBack} sx={{ mt: 2, ml: 2 }}>
        Back
      </Button>
    </Paper>
  );
};

export default AppointmentSummary; 