import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../@types/user';

// interface FormData extends IUser {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
// }

interface InitialState {
    user: IUser;
    role: 'admin' | 'labor' | 'user' | null;
    loading: boolean;
    error: object;
    isUserAthenticated: boolean;
    accessToken: string;
    modal: boolean;
    formData: Partial<IUser>;
    isLaborAuthenticated: boolean; // Add this property
    laborer: object | null; // Add this property
    locationOfUser: { latitude: number | null; longitude: number | null }; 
}

const initialState: InitialState = {
    user: {} as IUser,
    loading: false,
    error: {},
    role: null,
    isUserAthenticated: false,
    accessToken: "",
    modal: false,
    formData: {},
    isLaborAuthenticated: false, // Default value
    laborer: null, // Default value
    locationOfUser: { latitude: null, longitude: null },
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.role = action.payload.role;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setisUserAthenticated(state, action) {
            state.isUserAthenticated = action.payload;
        },
        setAccessToken(state, action) {
            state.accessToken = action.payload;
        },
        setModal(state, action) {
            state.modal = action.payload;
        },
        setFormData(state, action) {
            state.formData = action.payload;
        },
        setLocationOfUser(state, action) {
            state.locationOfUser = action.payload; // Update the user's location
        },
        resetUser(state) {
            state.user = {} as IUser;
            state.loading = false;
            state.error = {};
            state.isUserAthenticated = false;
            state.accessToken = "";
            state.modal = false;
             state.formData = {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
            };
             state.isLaborAuthenticated = false; // Reset labor authentication
            state.laborer = null; // Clear laborer data
            state.locationOfUser = { latitude: null, longitude: null }; 
        }
    }
})


export const { setUser, setAccessToken, resetUser, setError, setFormData, setisUserAthenticated,setLocationOfUser , setLoading, setModal } = userSlice.actions

export default userSlice.reducer
export type { InitialState }; 
