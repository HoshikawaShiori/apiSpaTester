import React, { useState, useEffect } from "react";
import SelectService from "./SelectService";
import SelectDate from "./SelectDate";
import SelectTime from "./SelectTime";
import SelectDentist from "./SelectDentist";
import AppointmentSummary from "./AppointmentSummary";
import SelectPaymentMethod from "./SelectPaymentMethod";
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
  const [successMsg, setSuccesMsg] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

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

  const postPayment = (appointment: number) => {
    setLoading(true);
    const response = api.post("/api/v1/post-payment", {
      appointmentId: appointment,
      paymentMethod: paymentMethod,
    });
    return response;
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
        setSuccesMsg(JSON.stringify(response.data.message))
        setStep(0);
        setService(null);
        setDate("");
        setTime("");
        setDentist(null);

       const paymentResponse= await postPayment(response.data.appointment);
       setLoading(false);
       onBookingSuccess();
        window.location.href = paymentResponse.data.checkout_url;
        // Call the success callback to trigger refetch
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
          {successMsg}
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
        <SelectPaymentMethod
          onSelect={setPaymentMethod}
          onNext={handleNextStep}
          onBack={handlePreviousStep}
          selectedMethod={paymentMethod}
        />
      )}
      {step === 5 && (
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
