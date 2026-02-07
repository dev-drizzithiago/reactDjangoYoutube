import { consigureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

import storageSession from 'redux.persist/lib/storage/session';
import sessionReducer from './sessionSlice';