import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/use-auth';

const ProtectedRoute = ({ children, redirectTo }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return children;
  }

  return <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
