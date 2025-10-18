import { useState, useEffect } from "react"

const requestDjango = () => {  
    const [dado, setDados] = useState([])
    const [carregando, setCarregando] = useState(false)

    return (
        <div className="divPrincipalRequestDjango">
            useEffect(() => {
                fetch(urlDjango, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    credentials: 'include',
                    body: JSON.stringify({action: 'requesting'}),
                });
            }, [urlDjango]);
            if (carregando) <p>Carregando...</p>
        </div>
    )
}

export default requestDjango


