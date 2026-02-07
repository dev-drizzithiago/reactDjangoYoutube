import { createSliece } from '@reduxjs/toolkit';

const sessionSlice = createSliece({
    nome: 'session',
    initialState: {
        usuario: null, logado: false
    }
})