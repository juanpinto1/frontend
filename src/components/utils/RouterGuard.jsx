  import { Navigate, Outlet } from 'react-router-dom';

  export const RouterGuard = ({ isAllowed, redirectPath = '/login', children }) => {
    if (!isAllowed) {
      return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
  };
