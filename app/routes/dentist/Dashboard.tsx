import Typography from "@mui/material/Typography";
import useUserData from "../../hooks/useUserData";

export default function DentistDashboard() {
  const { userData } = useUserData();
  return (
    <div>
      <Typography>
        <strong>Dr. </strong> {userData?.name} {userData?.middle_name}{" "}
        {userData?.last_name}
      </Typography>
    </div>
  );
}
