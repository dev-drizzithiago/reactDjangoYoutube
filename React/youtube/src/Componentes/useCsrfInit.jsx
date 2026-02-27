import { useEffect } from "react";
import { useDispatch } from 'react-redux';

// - Importa as actions criadas no slice.
import { loginSuccess, logout } from "./sessionSlice";

const urlDefaultDjango = `http://192.168.15.250:8080`

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
            if (data.user_logado) {
                dispatch(loginSuccess({
                    logado: data.user_logado,
                    usuario: data.nome_usuario,
                }))
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