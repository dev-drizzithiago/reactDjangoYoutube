import { useEffect } from "react"

const urlDefaultDjango = "http://localhost:8000"

const useCsrfInit = () => {

    const urlDjango =" http://localhost:8000/csrf_token_view/"
    
    useEffect(()=>{
        fetch(urlDjango, {
            method: 'GET',
            credentials: 'include', // Recebe o cookies do django
        })
        .then(() => {
            //console.log('CSRF cookie recebido');
        })
        .catch(err => {
            console.error("Erro ao obter CSRF cookie: ", err)
        })
    })

    return (
        <div></div>
    )
}



export default useCsrfInit;