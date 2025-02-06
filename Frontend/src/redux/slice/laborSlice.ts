import { createSlice } from '@reduxjs/toolkit';
import { ILaborer } from "../../@types/labor";

// Define the initial state interface
interface InitialState {
  laborer: ILaborer;
  loading: boolean;
  error: object | null;
  accessToken: string;
  modal: boolean;
  isLaborAuthenticated:false,
  formData: Partial<ILaborer>;
  unsavedChanges: false,
  navigateBack: false,
  isMobileChatListOpen: boolean,
}

const initialState: InitialState = {
  laborer: {} as ILaborer,
  loading: false,
  error: null,
  accessToken: '',
  modal: false,
  isLaborAuthenticated:false,
  formData: {},
  unsavedChanges: false,
  navigateBack: false,
  isMobileChatListOpen: false,
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
    setIsLaborAuthenticated(state, action){
      state.isLaborAuthenticated = action.payload;
    },
    setUnsavedChanges(state, action) {
      state.unsavedChanges = action.payload
    },
     toggleMobileChatList: (state) => {
      state.isMobileChatListOpen = !state.isMobileChatListOpen;
    },
    resetLaborer(state) {
      state.laborer = {} as ILaborer;
      state.loading = false;
      state.error = null;
      state.accessToken = '';
      state.modal = false;
      state.formData = {};
      state.isMobileChatListOpen = false
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
  setIsLaborAuthenticated,
  resetLaborer,
  toggleMobileChatList
} = laborerSlice.actions;

export default laborerSlice.reducer;
export type { InitialState };