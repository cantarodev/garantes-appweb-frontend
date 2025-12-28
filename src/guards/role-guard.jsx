import { Navigate } from 'react-router-dom';
import useUserRole from 'src/hooks/use-user-role';

export const RoleGuard = ({ allowedRoles, children }) => {
  const { userRole, loading } = useUserRole();

  if (!loading) {
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/401" />;
    }
  }

  return children;
};
