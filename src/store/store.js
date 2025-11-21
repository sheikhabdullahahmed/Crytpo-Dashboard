import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "../features/watchlistSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";


const persistConfig = {
  key: "root",
  storage,
    whitelist: ["watchlist"],
};


// const rootReducer = combineReducers({ user: watchlistReducer });
const rootReducer = combineReducers({
  watchlist: watchlistReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);
// const watchlistReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});



export const persistor = persistStore(store);
