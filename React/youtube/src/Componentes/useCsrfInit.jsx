import { useEffect } from "react";
import { useDispatch } from 'react-redux';

// - Importa as actions criadas no slice.
import { loginSuccess, logout } from "./sessionSlice";

import { urlDefaultDjango } from "../urls";

/**
 * Hook que, ao montar, faz um GET no Django para receber o cookie CSRF e
 * verificar/atualizar no Redux se o usuário já está logado.
 * @returns {JSX.Element} Não renderiza nada visível (retorna fragmento vazio).
 */
const useCsrfInit = () => {

    const urlDjango =`${urlDefaultDjango}/csrf_token_view/`    

    // - Cria dispatch para enviar ações.
    const dispatch = useDispatch()
    
    useEffect(()=>{
        fetch(urlDjango, {
            method: 'GET',
            credentials: 'include', // Recebe o cookies do django
        })
        .then(data => data.json())
        .then((data) => {
            
            console.log('Cookies recebido com sucesso.')

            // console.log('Dados recebidos: ', data)
        
            if (data.usuario_logado) {
               dispatch(loginSuccess({
                   usuario: data.usuario_login,
                   nomeUsuario: data.nome_usuario,
                   logado: data.usuario_logado
                }));
            } else {
                dispatch(logout())
            }
        })
        .catch(err => {
            console.error("Erro ao obter CSRF cookie: ", err)
        })
    })

    return (
        <></>
    )
}

export default useCsrfInit;