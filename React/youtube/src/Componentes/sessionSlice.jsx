// - Importa a função createSlice do Redux Toolkit, que facilita a criação de reducers e actions.
import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
    name: 'session',  // → dá um nome ao slice, usado internamente pelo Redux.
    initialState: { nomeUsuario: null, usuario: null, logado: false },  // → estado inicial: nenhum usuário (null) e logado: false.

    reducers: {  // → funções que alteram o estado:
        /**
         * Atualiza o estado global com os dados do usuário que acabou de logar.
         * @param {object} state - Estado atual do slice.
         * @param {object} action - Action do Redux; action.payload traz { usuario, nomeUsuario, logado }.
         * @returns {void}
         */
        loginSuccess(state, action) {  // → recebe action.payload (o usuário logado) e atualiza o estado para logado: true.

            state.usuario = action.payload.usuario;
            state.nomeUsuario = action.payload.nomeUsuario;
            state.logado = action.payload.logado;

        },

        /**
         * Limpa os dados do usuário logado do estado global.
         * @param {object} state - Estado atual do slice.
         * @returns {void}
         */
        logout(state) {  // logout → limpa o usuário e marca como deslogado.
            state.usuario = null;
            state.nomeUsuario = null;
            state.logado = false;
        },
    },
});

export const { loginSuccess, logout } = sessionSlice.actions;  // - Exporta as actions (loginSuccess, logout) para serem usadas nos componentes.
export default sessionSlice.reducer; // - Exporta o reducer para ser registrado no store.
