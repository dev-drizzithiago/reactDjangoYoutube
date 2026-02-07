import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux.persist/lib/storage/session';  // - storageSession → usa o sessionStorage do navegador para guardar o estado.
import sessionReducer from './sessionSlice';  // sessionReducer → o reducer que criamos no bloco 1.

// - key: "root" → chave usada para salvar no storage.  
// - storage: storageSession → define que será salvo no sessionStorage
const persistConfig = {key: 'root', storage: storageSession}; 

//- Cria um reducer “persistido”: combina o reducer original 
// com a lógica de salvar/carregar do storage.
const persistedReducer = persistedReducer(persistConfig, sessionReducer);

//- store → cria o Redux store com o reducer persistido.
export const store = configureStore({reducer: {session: persistedReducer} });

//- persistor → controla o processo de persistência (hidratar estado ao recarregar).
export const persistor = persistStore(store)