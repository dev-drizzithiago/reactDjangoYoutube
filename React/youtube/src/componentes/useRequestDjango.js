import getCookies from "./getCookies"

const useRequestDjango = (urlDjango, payload) => {
    const payloadString = JSON.stringify(payload)
    console.log(urlDjango)
    
    fetch(urlDjango, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':  getCookies('csrftoken'),
        },
        body: payloadString,
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        return data
    })
    .catch (error => {
        console.error('Erro na requisição: ', error)
    })
}

export default useRequestDjango
