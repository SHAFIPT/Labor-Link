import { createSlice } from '@reduxjs/toolkit';
import { ILaborer } from "../../@types/labor";

// Define the initial state interface
interface InitialState {
  laborer: ILaborer;
  loading: boolean;
  error: object | null;
  accessToken: string;
  modal: boolean;
  formData: Partial<ILaborer>;
  unsavedChanges: false,
  navigateBack: false,
}

const initialState: InitialState = {
  laborer: {} as ILaborer,
  loading: false,
  error: null,
  accessToken: '',
  modal: false,
  formData: {},
  unsavedChanges: false,
  navigateBack: false,
  
};

// Create the slice
const laborerSlice = createSlice({
  name: 'laborer',
  initialState,
  reducers: {
    setLaborer(state, action) {
      state.laborer = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setModal(state, action) {
      state.modal = action.payload;
    },
    setNavigateBack(state, action) {
      state.navigateBack = action.payload
    },
    setFormData(state, action) {
      state.formData = action.payload;
    },
    setUnsavedChanges(state, action) {
      state.unsavedChanges = action.payload
    },
    resetLaborer(state) {
      state.laborer = {} as ILaborer;
      state.loading = false;
      state.error = null;
      state.accessToken = '';
      state.modal = false;
      state.formData = {};
    },
  },
});

export const {
  setLaborer,
  setLoading,
  setError,
  setAccessToken,
  setModal,
  setFormData,
  setUnsavedChanges,
  setNavigateBack,
  resetLaborer,
} = laborerSlice.actions;

export default laborerSlice.reducer;
export type { InitialState };