import { type RouteConfig, index } from "@react-router/dev/routes";


export default [
  index("routes/App.tsx"), // Default route
  {
    path: "/authenticated",
    file: "routes/AuthenticatedPage.tsx", 
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
