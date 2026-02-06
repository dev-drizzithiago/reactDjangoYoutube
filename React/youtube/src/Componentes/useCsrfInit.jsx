import { useEffect, useState } from "react";

const urlDefaultDjango = `http://localhost:8080`

const useCsrfInit = () => {

    const [dataDjango, setDataDjango] = useState(false)

    const urlDjango =`${urlDefaultDjango}/csrf_token_view/`
    
    useEffect(()=>{
        fetch(urlDjango, {
            method: 'GET',
            credentials: 'include', // Recebe o cookies do django
        })
        .then(data => data.json())
        .then((data) => {
            console.log(data)

            setDataDjango(data)
            
            //console.log('CSRF cookie recebido');
        })
        .catch(err => {
            console.error("Erro ao obter CSRF cookie: ", err)
        })
    }, [])

    return {dataDjango}
}

export default useCsrfInit;