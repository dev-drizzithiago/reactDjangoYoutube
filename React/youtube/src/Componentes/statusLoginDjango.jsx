import sendRequestDjango from "./sendRequestDjango";

export const verificarUsuarioLogado = async (linkSendRequest, PAYLOAD) => {
    const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)
    return responseDjango.usuario_logado
}

export const logarUsuario = async (linkSendRequest, PAYLOAD) => {
    const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)
    return responseDjango
}

export const deslogarUsuario = async (linkSendRequest, PAYLOAD) => {
    const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)
    return responseDjango
}
