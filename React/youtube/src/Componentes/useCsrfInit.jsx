import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';

// - Importa as actions criadas no slice.
import { loginSuccess, logout } from "./sessionSlice";

const urlDefaultDjango = `http://localhost:8080`

const useCsrfInit = () => {

    const urlDjango =`${urlDefaultDjango}/csrf_token_view/`
    const [statusLogin, setStatusLogin] = useState(false)

    // - Cria dispatch para enviar ações.
    const dispatch = useDispatch()
    
    useEffect(()=>{
        fetch(urlDjango, {
            method: 'GET',
            credentials: 'include', // Recebe o cookies do django
        })
        .then(data => data.json())
        .then((data) => {
            console.log('CSRF cookie recebido');
            console.log(data);

            if (data.user_logado) {
                dispatch(loginSuccess(data.user_logado))
            } else {
                dispatch(logout())
            }
        })
        .catch(err => {
            console.error("Erro ao obter CSRF cookie: ", err)
        })
    })

    return (
        <div></div>
    )
}

export default useCsrfInit;