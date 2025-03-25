import Typography from "@mui/material/Typography";
import useUserData from "../../hooks/useUserData";
import Appointments from "~/components/dentist/Appointments";
import { useState } from "react";

export default function DentistDashboard() {
  const { userData } = useUserData();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  return (
    <div>
      <Appointments refetchTrigger={refetchTrigger}/>
    </div>
  );
}
