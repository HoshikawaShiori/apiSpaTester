import { type RouteConfig, index } from "@react-router/dev/routes";


export default [
  index("routes/App.tsx"), // Default route
  {
    path: "/authenticated",
    file: "routes/AuthenticatedPage.tsx", 
  },
] satisfies RouteConfig;
