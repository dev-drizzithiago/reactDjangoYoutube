import { useState, useEffect } from 'react';
import sendRequestDjango from './sendRequestDjango'

const VerificarUsuarioLogado = ({}) => {

    const [statusLogin, setStatusLogin] = useState(false)

    /** Verifica se o usuário esta logado. */
    useEffect(() => {
        console.log('Usuario Logado: ', statusLogin)

        const verificarStatusLogin = async () => {
            if (!statusLogin) {  // Se o usuario estiver deslogado continua o processo
                const PAYLOAD = {
                    'tipoRequest': 'verificarUsuarioLogado',
                }
                const urlDjangoLogin = `http://localhost:8000/credenciais_login/`;
                const responseDjango = await sendRequestDjango(urlDjangoLogin, PAYLOAD)
                
                if (responseDjango.usuario_logado) 
                    {
                    setStatusLogin(true)

                } else if (!responseDjango.usuario_logado){

                    setStatusLogin(false)
                }
            }
        }

        verificarStatusLogin()

  }, [])

  return statusLogin
}

export default VerificarUsuarioLogado