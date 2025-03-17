import React, { useState, useEffect } from "react";
import SelectService from "./SelectService";
import SelectDate from "./SelectDate";
import SelectTime from "./SelectTime";
import SelectDentist from "./SelectDentist";
import AppointmentSummary from "./AppointmentSummary";
import api from "../api/config";
import { Alert, AlertTitle } from "@mui/material";

const Booking = () => {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [dentist, setDentist] = useState(null);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (service) {
      const fetchFullyBookedDates = async () => {
        const response = await api.get(
          `api/v1/appointment/fully-booked-dates/?service_id=${service.id}`
        );
        setFullyBookedDates(response.data.fully_booked_dates);
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
      setSuccess(false);
      setError(false);
      const serviceId = service.id;
      const dentistId = dentist.id;
      const selectedDate = date;
      const selectedTime = time;

      const response = await api.post(
        "/api/v1/appointment/set-appointment",
        {
          serviceId: serviceId,
          dentistId: dentistId,
          date: selectedDate,
          time: selectedTime,
        }
      );

      console.log("Appointment successfully booked:", response.data);

      
      setStep(0);
      setService(null);
      setDate("");
      setTime("");
      setDentist(null);
      setSuccess(true)
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError(true);
    }
  };

  const resetBookingStatus =() =>{
    setSuccess(false);
    setError(false);
  }

  return (

    
    <div>
          {success ? (
      <Alert severity="success" onClose={resetBookingStatus}>
        <AlertTitle>Success</AlertTitle>
        Appointment successfully booked!
      </Alert>
    ) : error ? (
      <Alert severity="error" onClose={resetBookingStatus}>
        <AlertTitle>Error</AlertTitle>
        Error booking appointment
      </Alert>
    ) : null}
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
