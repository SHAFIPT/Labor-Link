import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slice/userSlice'
import laborerSlice from '../slice/laborSlice'
import adminSlice from '../slice/adminSlice'
import themeReducer from '../slice/themeSlice'; 
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root", // Key for storage
    storage,     // Storage to use (localStorage or AsyncStorage)
};

// Wrap reducers with persistReducer
const persistedLaborReducer = persistReducer(persistConfig, laborerSlice);
const persistedAdminReducer = persistReducer(persistConfig, adminSlice);
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persisteddarkModeReducer = persistReducer(persistConfig, themeReducer);


export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        labor: persistedLaborReducer,
        admin: persistedAdminReducer,
        theme: persisteddarkModeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable checks for non-serializable values
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export default store;