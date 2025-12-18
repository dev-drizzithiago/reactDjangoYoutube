import sendRequestDjango from './sendRequestDjango'


const verificarStatusLogin = async () => {
    if (!statusLogin) {  // Se o usuario estiver deslogado continua o processo
        const PAYLOAD = {
            'tipoRequest': 'verificarUsuarioLogado',
        }
        const urlDjangoLogin = `http://localhost:8000/credenciais_login/`;
        const responseDjango = await sendRequestDjango(urlDjangoLogin, PAYLOAD)        
        if (responseDjango.usuario_logado) {
            console.log(responseDjango.usuario_logado)
        } else if (!responseDjango.usuario_logado){
            console.log(responseDjango.usuario_logado)
        }
    }
    return 'statusLogin'
}

export default verificarStatusLogin



