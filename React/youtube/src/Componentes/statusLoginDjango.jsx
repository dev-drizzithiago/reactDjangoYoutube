import sendRequestDjango from "./sendRequestDjango";

export const verificarUsuarioLogado = async (linkSendRequest, PAYLOAD) => {
    const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)
    return responseDjango
}

export const logarUsuario = async (linkSendRequest, PAYLOAD) => {
    const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)
    return responseDjango
}

export const deslogarUsuario = async (linkSendRequest, PAYLOAD) => {
    const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)
    return responseDjango
}

export default logarUsuario