import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authhelper';
import { getUserRole } from '../utils/authhelper';
export default function ProtectedRoute({ children ,requiredRole}) {
 const userRole = getUserRole();
  return isAuthenticated() ? requiredRole === userRole ? children : <Navigate to="/"></Navigate> : <Navigate to="/"></Navigate> ;
}