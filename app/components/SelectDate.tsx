import React, { useState } from "react";
import { Button, Container, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const SelectDate = ({ service, fullyBookedDates, onSelect, onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    onSelect(dayjs(newDate).format("YYYY-MM-DD")); // Send formatted date to parent
  };

  return (
    <div>
      <Typography variant="h6">Select a Date</Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container>
          <DatePicker
            label="Select a date"
            value={selectedDate}
            onChange={handleDateChange}
            shouldDisableDate={(date) =>
              fullyBookedDates.includes(dayjs(date).format("YYYY-MM-DD"))
            }
          />
        </Container>
      </LocalizationProvider>

      <Button onClick={onBack}>Back</Button>
      <Button onClick={onNext} disabled={!selectedDate}>
        Next
      </Button>
    </div>
  );
};

export default SelectDate;
