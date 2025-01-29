import { IAdmin } from "../@types/admin";
import { adminAxiosInstance } from './instance/adminInstance'

const api = adminAxiosInstance;

export default api;

export const AdminLogin = async (credential: Partial<IAdmin>) => {
    const response = await api.post('/api/admin/auth/adminLoginPage', credential)
    return response
}

export const logout = async () => {
  const response = await api.post('/api/admin/auth/logout')
  return response
}

export const fetchUser = async (query, pageNumber) => {
  const resonse = await api.get('/api/admin/user/usersFetch', {
    params: { query, page: pageNumber },
  })
  return resonse
}

export const fetchLabor = async (query, pageNumber) => {
  const response = await api.get('/api/admin/user/laborsFetch', {
    params: { query, page: pageNumber },
  });
  return response;
};

export const blockUser = async ({email}) => {
  const response = await api.patch('/api/admin/user/userBlock',{email})
  return response
}
export const UnblockUser = async ({email}) => {
  const response = await api.patch('/api/admin/user/userUnblock',{email})
  return response
}
export const blockLabor = async ({email}) => {
  const response = await api.patch('/api/admin/user/laborBlock',{email})
  return response
}
export const UnblockLabor = async ({email}) => {
  const response = await api.patch('/api/admin/user/laborUnblock',{email})
  return response
}

export const deleteLabor = async ({ email }) => {
  const response = await adminAxiosInstance.delete('/api/admin/user/deleteLabor', {
    params : {email}
  })
  return response
}
export const Approve = async ({ email }) => {
  const response = await api.patch('/api/admin/user/laborApprove', { email })
  return response
}

export const rejection = async ({ reason , email }) => {
  const response = await api.post('/api/admin/user/rejectionReson', { reason  , email})
  return response
}