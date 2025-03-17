import React, { useState, useEffect } from "react";
import SelectService from "./SelectService";
import SelectDate from "./SelectDate";
import SelectTime from "./SelectTime";
import SelectDentist from "./SelectDentist";
import AppointmentSummary from "./AppointmentSummary";
import api from "../api/config";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";

interface BookingProps {
  onBookingSuccess: () => void;
}

const Booking: React.FC<BookingProps> = ({ onBookingSuccess }) => {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [dentist, setDentist] = useState(null);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (service) {
      const fetchFullyBookedDates = async () => {
        try {
          setLoading(true);
          const response = await api.get(
            `api/v1/appointment/fully-booked-dates/?service_id=${service.id}`
          );
          setFullyBookedDates(response.data.fully_booked_dates);
        } catch (error) {
          const message = error.response?.data?.message || "Failed to fetch booked dates";
          setErrorMessage(message);
        } finally {
          setLoading(false);
        }
      };
      fetchFullyBookedDates();
    }
  }, [service]);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleBookingSubmit = async () => {
    try {
      setLoading(true);
      setSuccess(false);
      setError(false);
      setErrorMessage("");

      const response = await api.post("/api/v1/appointment/set-appointment", {
        serviceId: service.id,
        dentistId: dentist.id,
        date: date,
        time: time,
      });

      if (response.status === 201) {
        setSuccess(true);
        // Reset form
        setStep(0);
        setService(null);
        setDate("");
        setTime("");
        setDentist(null);
        
        // Call the success callback to trigger refetch
        onBookingSuccess();
      }
    } catch (error) {
      setError(true);
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     "Failed to book appointment";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const resetBookingStatus =() =>{
    setSuccess(false);
    setError(false);
  }

  return (
    <div>
      {loading && <CircularProgress />}
      
      {success && (
        <Alert severity="success" onClose={resetBookingStatus}>
          <AlertTitle>Success</AlertTitle>
          Appointment successfully booked!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" onClose={resetBookingStatus}>
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}
      
      {step === 0 && (
        <SelectService onSelect={setService} onNext={handleNextStep} />
      )}
      {step === 1 && (
        <SelectDate
          service={service}
          fullyBookedDates={fullyBookedDates}
          onSelect={setDate}
          onNext={handleNextStep}
          onBack={handlePreviousStep}
        />
      )}
      {step === 2 && (
        <SelectTime
          service={service}
          date={date}
          onSelect={setTime}
          onNext={handleNextStep}
          onBack={handlePreviousStep}
        />
      )}
      {step === 3 && (
        <SelectDentist
          service={service}
          date={date}
          time={time}
          onSelect={setDentist}
          onSubmit={handleNextStep}
          onBack={handlePreviousStep}
        />
      )}
      {step === 4 && (
        <AppointmentSummary
          service={service}
          date={date}
          time={time}
          dentist={dentist}
          onBack={handlePreviousStep}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default Booking;
