import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slice/userSlice'
import laborerSlice from '../slice/laborSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        labor:laborerSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export default store;