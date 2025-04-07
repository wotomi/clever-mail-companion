
import { Navigate } from "react-router-dom";

const Index = () => {
  // The Index page simply redirects to the Dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
