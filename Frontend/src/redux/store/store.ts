import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slice/userSlice'
import laborerSlice from '../slice/laborSlice'
import adminSlice from '../slice/adminSlice'
import themeReducer from '../slice/themeSlice'; 
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Separate persist configs for each reducer
const userPersistConfig = {
    key: "userState",
    storage,
    blacklist: ['error', 'loading'] // Optionally exclude certain fields
};

const laborPersistConfig = {
    key: "laborState",
    storage,
    blacklist: ['error', 'loading']
};

const adminPersistConfig = {
    key: "adminState",
    storage,
    blacklist: ['error', 'loading']
};

const themePersistConfig = {
    key: "themeState",
    storage
};

// Wrap each reducer with its own config
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedLaborReducer = persistReducer(laborPersistConfig, laborerSlice);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminSlice);
const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        labor: persistedLaborReducer,
        admin: persistedAdminReducer,
        theme: persistedThemeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Helper function to clear specific states
export const clearState = (stateKey: 'user' | 'labor' | 'admin') => {
    localStorage.removeItem(`persist:${stateKey}State`);
};

// Helper function to clear all states
export const clearAllStates = () => {
    localStorage.removeItem('persist:userState');
    localStorage.removeItem('persist:laborState');
    localStorage.removeItem('persist:adminState');
    // Optionally keep theme: localStorage.removeItem('persist:themeState');
};

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export default store;