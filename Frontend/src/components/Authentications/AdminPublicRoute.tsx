import { RootState } from '../../redux/store/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'


const AdminPublicRoute = ({ children }) => {
    const isAuthenticated = useSelector((state:RootState)=>state.admin.isAuthenticated)
    return isAuthenticated ? <Navigate to='/admin/adimDashboard' /> : children
}
export default AdminPublicRoute