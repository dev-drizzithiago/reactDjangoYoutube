import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
    name: 'session',
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
export default sessionSlice.reducer;
