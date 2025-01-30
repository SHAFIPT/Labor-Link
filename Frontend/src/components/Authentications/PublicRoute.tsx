    import { Navigate } from 'react-router-dom';
    import { useSelector } from 'react-redux';
    import { RootState } from '../../redux/store/store';

    interface PublicRouteProps {
      children: React.ReactNode;
    }           

    const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {

      const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAthenticated)
      const user = useSelector((state: RootState) => state.user.user)
      const role = useSelector((state:RootState)=>state.user.role)
      const UserformData = useSelector((state: RootState) => state.user.formData)
      console.log('thsi is logingin :',isUserAuthenticated)
      console.log('thsi is user :',user)
      console.log('thsi is user formData :',UserformData)
      const isLaborAuthenticated = useSelector((state: RootState) => state.labor.isLaborAuthenticated)
      const laborer = useSelector((state: RootState) => state.labor.laborer)
      const formData = useSelector((state: RootState) => state.labor.formData)

     console.log('thsi is labor :',laborer)
      console.log('thsi is labor formData :',formData)
      
      if (isUserAuthenticated) {
        console.log('-  - - - - -home --s--');
        
        return <Navigate to='/'/>
      }
      

      if (isLaborAuthenticated && location.pathname !== '/ProfilePage') {
          return <Navigate to='/labor/laborDashBoard' />;
        }
      return <>{children}</>
    }

    export default PublicRoute;
