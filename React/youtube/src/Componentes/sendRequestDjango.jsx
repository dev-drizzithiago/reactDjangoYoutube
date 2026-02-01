import getCookies from "./getCookies";

async function sendRequestDjango(linkSendRequest, payload) {

    console.log(linkSendRequest)
    
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