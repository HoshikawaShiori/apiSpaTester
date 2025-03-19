import React from "react";
import { Button, Container, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface SelectPaymentMethodProps {
  onSelect: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
  selectedMethod: string | null;
}

const SelectPaymentMethod: React.FC<SelectPaymentMethodProps> = ({ onSelect, onNext, onBack, selectedMethod }) => {
  const paymentMethods = ["brankas", "card", "dob", "gcash", "grab_pay", "billease", "paymaya"];

  const toPascalCase = (str: string) => {
    return str.replace(/(^\w|_\w)/g, (match) => match.replace('_', '').toUpperCase());
  };

  return (
    <Container>
      <Typography variant="h6">Select Payment Method</Typography>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="payment-method-label">Payment Method</InputLabel>
        <Select
          labelId="payment-method-label"
          value={selectedMethod || ""}
          onChange={(e) => onSelect(e.target.value as string)}
          label="Payment Method"
        >
          {paymentMethods.map((method) => (
            <MenuItem key={method} value={method}>
              {toPascalCase(method)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={onBack}>
        Back
      </Button>
      <Button onClick={onNext}>

        
        Next
      </Button>
    </Container>
  );
};

export default SelectPaymentMethod; 