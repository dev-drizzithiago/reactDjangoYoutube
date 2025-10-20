import { useState, useEffect } from "react"
import getCookies from "./getCookies"

const useRequestDjango = (props) => {
    const payloadString = JSON.stringify(props.payload)
    console.log(payloadString)

    const [dados, setDados] = useState([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const getCookie = getCookies('csrftoken');

        fetch(props.urlDjango, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie,
            },
            body: payloadString,
        })
        .then(response => response.json())
        .then(data => {
            setDados(data.dados_django);
            setCarregando(false);
        })
        .catch (error => {
            console.error('Erro na requisição: ', error)
            setCarregando(false)
        })
    }, [props.urlDjango, payloadString]);

    return {dados, carregando}
}

export default useRequestDjango
