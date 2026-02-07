import { createSliece } from '@reduxjs/toolkit';

const sessionSlice = createSliece({
    nome: 'session',
    initialState: { usuario: null, logado: false },
    reducers: {
        loginSuccess(state, action) {
            state.usuario = action.payload;
            state.logado = true;
        },
        logout(state) {
            state.usuario = null;
            state.logado = false;
        },
    },
});

export const { loginSuccess, logout } = sessionSlice.actions;
export default sessionSlice.reducers;
