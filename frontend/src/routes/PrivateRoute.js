
import UseAuth from '../hooks/UseAuth';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = UseAuth();

    // 1️⃣ Loading must come from UseAuth, not from props
    if (loading) {
        return <div>Loading...</div>;
    }

    // 2️⃣ Not authenticated → go to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3️⃣ Check role access (optional)
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
