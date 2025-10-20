import getCookies from "./getCookies";

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

        const data = await response.json();
        console.log(data);

        return data
    } catch (error) {
        console.error("Erro ao enviar os dados para o Django.", error);
    }
}

export default sendRequestDjango;