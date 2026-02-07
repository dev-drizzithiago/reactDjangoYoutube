import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

import storageSession from 'redux.persist/lib/storage/session';
import sessionReducer from './sessionSlice';

const persistConfig = {key: 'root', storage: storageSession};
const persistedReducer = persistedReducer(persistConfig, sessionReducer);

export const store = configureStore({reducer: {session: persistedReducer} });
export const persistor = persistStore(store)