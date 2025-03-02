import { IAdmin } from "../@types/admin";
import { adminAxiosInstance } from './instance/adminInstance'

interface FetchUserParams {
  query: string;  // Assuming query is a string, adjust based on actual data type
  pageNumber: number;  // Assuming pageNumber is a number
  selectedFilter: string;  // Assuming selectedFilter is a string, adjust if needed
}

interface BlockUserParams {
  email: string;  // Define email as a string
}

interface UnblockUserParams {
  email: string;  // Define email as a string
}
interface UnblockLaborParams {
  email: string;  // Define email as a string
}

interface BlockLaborParams {
  email: string;  // Define email as a string
}

interface DeleteLaborParams {
  email: string;  // Define email as a string
}

interface ApproveParams {
  email: string;  // Define email as a string
}

interface RejectionParams {
  reason: string;  // Define reason as a string
  email: string;   // Define email as a string
}

interface SubmitDataParams {
  id: string | number;  // Define id as either string or number, based on your requirement
  status: string;          // Define status based on its expected structure (could be string, object, etc.)
}

interface FetchLaborParams {
  query: string;
  pageNumber: number;
  selectedFilter: string;
}

const api = adminAxiosInstance;

// export default api;

export const AdminLogin = async (credential: Partial<IAdmin>,role: string) => {
    const response = await api.post('/api/auth/login', {...credential, role})
    return response
}

export const logout = async () => {
  const response = await api.post('/api/auth/logout')
  return response
}

export const fetchUser = async ({ query, pageNumber, selectedFilter }: FetchUserParams) => {
  const resonse = await api.get('/api/admin/user/usersFetch', {
    params: { query, page: pageNumber , filter : selectedFilter },
  })
  return resonse
}

export const fetchLabor = async ({ query, pageNumber, selectedFilter }: FetchLaborParams) => {
  const response = await api.get('/api/admin/user/laborsFetch', {
    params: { query, page: pageNumber,filter : selectedFilter },
  });
  return response;
};

export const blockUser = async ({ email }: BlockUserParams) => {
  const response = await api.patch('/api/admin/user/userBlock',{email})
  return response
}
export const UnblockUser = async  ({ email }: UnblockUserParams) => {
  const response = await api.patch('/api/admin/user/userUnblock',{email})
  return response
}
export const blockLabor = async ({ email }: BlockLaborParams) => {
  const response = await api.patch('/api/admin/user/laborBlock',{email})
  return response
}
export const UnblockLabor = async ({ email }: UnblockLaborParams) => {
  const response = await api.patch('/api/admin/user/laborUnblock',{email})
  return response
}

export const deleteLabor = async ({ email }: DeleteLaborParams) => {
  const response = await adminAxiosInstance.delete('/api/admin/user/deleteLabor', {
    params : {email}
  })
  return response
}
export const Approve = async ({ email }: ApproveParams) => {
  const response = await api.patch('/api/admin/user/laborApprove', { email })
  return response
}

export const rejection = async ({ reason, email }: RejectionParams) => {
  const response = await api.post('/api/admin/user/rejectionReson', { reason  , email})
  return response
}
export const fetchAllBookings = async (
  page: number,
  limit: number,
  filter: string
) => {
  const response = await api.get(`/api/admin/user/fetchAllBookins?page=${page}&limit=${limit}&filter=${filter}`)
  return response
}

export const fetchLaborAllBookings = async (
  laborId : string,
  page: number,
  limit: number,
  filter: string
) => {
  const response = await api.get(
    `/api/admin/user/fetchLaborBookins/${laborId}?page=${page}&limit=${limit}&filter=${filter}`
  )
  return response
}   

export const fetchPending = async () => {
  const response = await api.get('/api/admin/user/fetchPendingWidrowRequsts')
  return response
}

export const submitData = async ({ id, status }: SubmitDataParams)  => {
  const response = await api.put(`/api/admin/user/submitAcitons/${id}`,
    status
  )
  return response
}
