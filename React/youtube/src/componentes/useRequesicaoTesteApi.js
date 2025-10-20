import { useEffect } from "react"

const useRequesicaoTesteApi = () => {

    const urlDjango =" http://localhost:8000/requestBaseDados/"
    
    useEffect( () => {                
        fetch(urlDjango, {
            method: 'GET',
            credentials: 'include',
        })
    }, [])
    
    

    return (
        <div>
           teste
        </div>
    )
}

export default useRequesicaoTesteApi;