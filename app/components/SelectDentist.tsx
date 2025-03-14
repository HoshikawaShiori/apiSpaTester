import React, { useEffect, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import api from '../api/config';

const SelectDentist = ({ service, date, time, onSelect, onSubmit, onBack }) => {
  const [dentists, setDentists] = useState([]);

  useEffect(() => {
    const fetchAvailableDentists = async () => {
      const response = await api.get(`api/v1/appointment/available-dentists/?service_id=${service.id}&date=${date}&time=${time}`);
      setDentists(response.data.available_dentists);
    };
    fetchAvailableDentists();
  }, [service, date, time]);

  return (
    <div>
      <Container>
        <Typography variant="h6">Select a Dentist</Typography>
        {dentists.map((dentist) => (
          <Button key={dentist.id} onClick={() => onSelect(dentist)}>
            Dentist ID: {dentist.id}
            Dentist Name: {dentist.name}
          </Button>
        ))}
      </Container>
      <Button onClick={onBack}>Back</Button>
      <Button onClick={onSubmit} disabled={!dentists.length}>
        Next
      </Button>
    </div>
  );
};

export default SelectDentist; 