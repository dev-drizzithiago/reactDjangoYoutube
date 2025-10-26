import { useState, useEffect } from "react"
import getCookies from "./getCookies"

const useRequestDjango = (props) => {

    console.log('teste')

    const payloadString = JSON.stringify(props.msg)

    const [dados, setDados] = useState([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        fetch(props.linkDjango, {
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
            setDados(data.dados_django);
            setCarregando(false);
        })
        .catch (error => {
            console.error('Erro na requisição: ', error)
            setCarregando(false)
        })
    }, [props.linkDjango, payloadString]);

    return {dados, carregando}
}

export default useRequestDjango
