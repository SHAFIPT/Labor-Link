import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  loading: false,
  error: {},
  isAuthenticated:false,
  accessToken: "",
  modal:false,
  formData:{},
  pageTitle:"Admin Panel",
  tempData:{}
};

const adminSlice = createSlice({

  name: 'admin',
  initialState,


  reducers: {

    setAdmin(state, action) {
      state.admin = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setIsAdminAuthenticated(state, action){
      state.isAuthenticated = action.payload;
    },
    setAccessToken(state,action){
      state.accessToken = action.payload;
    },
    setModal(state,action){
      state.modal = action.payload
    },
    setFormData(state, action) {
      state.formData = action.payload
    },
    setPageTitle(state,action){
      state.pageTitle = action.payload
    },
    setTempData(state,action){
      state.tempData = action.payload;
    },
    resetAdmin:() =>initialState,
    

  },


});

export const { setAdmin, setLoading, setError ,setIsAdminAuthenticated , setTempData, setAccessToken ,setModal , setFormData , resetAdmin ,setPageTitle } = adminSlice.actions;

export default adminSlice.reducer;

