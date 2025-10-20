import React, { useEffect } from 'react';

const useRequesicaoTesteApi = () => {
    const urlDjango =" http://localhost:8000/requestBaseDados/"
    return (
        <div>
            useEffect(() => {                
                    fatch(urlDjango, {
                        method: 'GET',
                        credentials: 'include',
                    })                
            }, [])
        </div>
    )
}

export default useRequesicaoTesteApi