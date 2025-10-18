import { useState, useEffect } from "react"
import getCookies from "./getCookies"

const requestDjango = (urlDjango ,payload) => {
    
    const [dado, setDados] = useState([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const {getCookie} = getCookies('csrftoken');

        fetch(urlDjango, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie,
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            setDados(data);
            setCarregando(false);
        })
        .catch (error => {
            console.error('Erro na requisição: ', error)
            setCarregando(false)
        })
    }, [urlDjango, JSON.stringify(payload)]);

    if (carregando) <p>Carregando...</p>

    return {dado, carregando}
}

export default requestDjango


