import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authhelper';
import { getUserRole } from '../utils/authhelper';

export default function PrivateRoute({ children , requiredRole}) {
  const userRole = getUserRole();
  return isAuthenticated() ? requiredRole === userRole ? children : <Navigate to="/home"></Navigate> : <Navigate to="/"></Navigate>;
}