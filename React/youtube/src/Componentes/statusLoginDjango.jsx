import sendRequestDjango from "./sendRequestDjango";

/**
 * Consulta o Django para saber se o usuário atual continua logado.
 * @param {string} linkSendRequest - URL do endpoint de credenciais no Django.
 * @param {object} PAYLOAD - Payload com 'tipoRequest': 'verificarUsuarioLogado'.
 * @returns {Promise<boolean>} Retorna se o usuário está logado.
 */
export const verificarUsuarioLogado = async (linkSendRequest, PAYLOAD) => {
    const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)
    return responseDjango.usuario_logado
}

/**
 * Envia as credenciais do usuário para o Django realizar o login.
 * @param {string} linkSendRequest - URL do endpoint de credenciais no Django.
 * @param {object} PAYLOAD - Payload com 'tipoRequest': 'realizarLogin' e os dados de login.
 * @returns {Promise<*>} Retorna a resposta completa do Django.
 */
export const logarUsuario = async (linkSendRequest, PAYLOAD) => {
    const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)
    return responseDjango
}

/**
 * Solicita ao Django que encerre a sessão do usuário logado.
 * @param {string} linkSendRequest - URL do endpoint de credenciais no Django.
 * @param {object} PAYLOAD - Payload com 'tipoRequest': 'deslogarUsuario'.
 * @returns {Promise<*>} Retorna a resposta completa do Django.
 */
export const deslogarUsuario = async (linkSendRequest, PAYLOAD) => {
    const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)
    return responseDjango
}
