import { useEffect } from "react";
import { useDispatch } from 'react-redux';

// - Importa as actions criadas no slice.
import { loginSuccess, logout } from "./sessionSlice";

<<<<<<< HEAD
import { urlDefaultDjango } from "../urls";
=======
const urlDefaultDjango = `http://192.168.15.250:8000`
>>>>>>> ea5ab8b69e59f943b96300f8f27795ae15c0feb1

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