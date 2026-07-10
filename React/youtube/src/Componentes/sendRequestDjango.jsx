import getCookies from "./getCookies";

/**
 * Envia uma requisição POST manual para o Django (usada em ações do usuário, não automáticas).
 * @param {string} linkSendRequest - URL do endpoint Django que receberá a requisição.
 * @param {*} payload - Dados enviados no corpo da requisição.
 * @returns {Promise<*>} Retorna a resposta do Django já convertida em JSON.
 */
async function sendRequestDjango(linkSendRequest, payload) {
    
    const payloadString = JSON.stringify(payload)
    try {
        const response = await fetch(linkSendRequest, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookies('csrftoken'),
            },            
            body: payloadString,
            credentials: 'include',
        });

        const responseDjango = await response.json();  
        return responseDjango
        
    } catch (error) {
        console.error("Erro ao enviar os dados para o Django.", error);
    }
}

export default sendRequestDjango;