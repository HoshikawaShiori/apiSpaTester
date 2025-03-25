import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/AuthenticatedPage.tsx"), // Make AuthenticatedPage the root route
  {
    path: "/auth",
    file: "routes/App.tsx", // Login/Register page
  },
  {
    path: "staff/auth",
    file: "routes/StaffAuth.tsx", // Login/Register page
  },
  {
    path: "/admin",
    file: "routes/admin/AdminLayout.tsx",
    children: [
      {
        index: true,
        file: "routes/admin/Dashboard.tsx",
      },
    ]
  },
  {
    path: "/dentist",
    file: "routes/dentist/DentistLayout.tsx",
    children: [
      {
        index: true,
        file: "routes/dentist/Dashboard.tsx",
      },
      {
        path: "appointments",
        file: "routes/dentist/Appointments.tsx",
      },
    ]
  },
  {
    path: "/successPayment",
    file: "routes/SuccessPayment.tsx",
  },
  {
    path: "/failedPayment",
    file: "routes/FailedPayment.tsx",
  },
] satisfies RouteConfig;
