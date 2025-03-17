import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  Typography, 
  CircularProgress, 
  Alert, 
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import api from '../api/config';

interface Appointment {
  id: number;
  service: {
    id: number;
    name: string;
  };
  dentist: {
    id: number;
    name: string;
    middle_name?: string;
    last_name?: string;
  };
  date: string;
  time: string;
  status: string;
}

interface AppointmentListProps {
  refetchTrigger?: number;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ refetchTrigger }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get('/api/v1/appointment/user-appointments');
      const appointmentsData = response.data.appointments || [];
      setAppointments(appointmentsData);
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     "Failed to load appointments";
      setError(message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refetchTrigger]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Appointments
      </Typography>

      {Array.isArray(appointments) && appointments.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>No Appointments</AlertTitle>
          You don't have any appointments scheduled.
        </Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Dentist</TableCell>
                <TableCell>Status</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(appointments) && appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.service?.name|| 'N/A'}</TableCell>
                  <TableCell>{appointment.date}  </TableCell>
                  <TableCell> {appointment.time} </TableCell>
                  <TableCell>Dr. {appointment.dentist?.name  + " " + appointment.dentist?.middle_name + " " + appointment.dentist?.last_name || 'N/A'}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default AppointmentList; 