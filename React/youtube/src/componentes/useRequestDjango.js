import { useState, useEffect } from "react"
import getCookies from "./getCookies"

const useRequestDjango = (urlDjango, payload, trigger) => {
   
    const payloadString = JSON.stringify(payload)

    const [dados, setDados] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [usuarioLogado, setUsuarioLogado] = useState(null)

    useEffect(() => {
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
            if (data.erro_processo === 666 ) {
                setDados(data.dados_django);
                setCarregando(false);
                setUsuarioLogado(false)
            } else {
                setDados(data.dados_django);
                setCarregando(false); 
                setUsuarioLogado(true)
            }
        })
        .catch (error => {
            console.error('Erro na requisição: ', error)
            setCarregando(false)
        })
    }, [urlDjango, payloadString, trigger]);
    // "Execute o código dentro do useEffect sempre que qualquer um desses valores mudar."
    /** Se você deixar a lista vazia ([]), o useEffect só roda uma vez, quando o componente é montado. */
    /**
     * [] Só uma montagem
     * [a, b] Quando a ou b mudam
     * (sem lista) Toda renderização Se você não passar lista nenhuma, ele roda toda vez que o componente renderiza — o que pode causar loops indesejados.
     */

    return {dados, carregando, usuarioLogado}
}

export default useRequestDjango
