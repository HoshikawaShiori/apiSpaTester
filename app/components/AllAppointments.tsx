import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import api from "../api/config";

interface Appointment {
  id: number;
  patient: {
    id: number;
    name: string;
    middle_name?: string;
    last_name?: string;
  };
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
  refetchTrigger: number;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  refetchTrigger,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/v1/appointment/appointments?page=${page}`
      );
      setAppointments(response.data.appointments);
      setMaxPage(response.data.last_page);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refetchTrigger, page]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

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
        All Appointments
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
                <TableCell>Patient</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Dentist</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(appointments) &&
                appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {`${appointment.patient?.name || ""} ${
                        appointment.patient?.middle_name || ""
                      } ${appointment.patient?.last_name || ""}`.trim() ||
                        "N/A"}
                    </TableCell>

                    <TableCell>{appointment.service?.name || "N/A"}</TableCell>
                    <TableCell>{appointment.date} </TableCell>
                    <TableCell> {appointment.time} </TableCell>
                    <TableCell>
                      Dr.{" "}
                      {`${appointment.dentist?.name || ""} ${
                        appointment.dentist?.middle_name || ""
                      } ${appointment.dentist?.last_name || ""}`.trim() ||
                        "N/A"}
                    </TableCell>

                    <TableCell>{appointment.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </Button>
          <Button onClick={handleNextPage} disabled={maxPage === page}>
            Next
          </Button>
        </TableContainer>
      )}
    </Paper>
  );
};

export default AppointmentList;
