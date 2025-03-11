    import { Navigate } from 'react-router-dom';
    import { useSelector } from 'react-redux';
    import { RootState } from '../../redux/store/store';

    interface PublicRouteProps {
      children: React.ReactNode;
    }           

    const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {

      const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAthenticated)
      const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)

      if (isUserAuthenticated) {
        return <Navigate to='/'/>
      }

      if (isLaborAuthenticated && location.pathname !== '/ProfilePage') {
          return <Navigate to='/labor/laborDashBoard' />;
        }
      return <>{children}</>
    }

    export default PublicRoute;
