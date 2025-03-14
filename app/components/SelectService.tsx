import React, { useEffect, useState } from 'react';
import api from '../api/config';
import { Button, Typography } from '@mui/material';

const SelectService = ({ onSelect, onNext }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await api.get('api/v1/services/');
      setServices(response.data);
    };
    fetchServices();
  }, []);

  return (
    <div>
      <Typography variant="h6">Select a Service</Typography>
      {services.map((service) => (
        <Button key={service.id} onClick={() => { onSelect(service); onNext(); }}>
          {service.name}
        </Button>
      ))}
    </div>
  );
};

export default SelectService;