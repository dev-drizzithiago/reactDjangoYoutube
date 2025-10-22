// Para colocar um qualquer elemento de html, é preciso esta sempre dentro de uma tag<div> => exemplo
import { useState } from "react";
import useRequestDjango from "./useRequestDjango";
import "./LinkBancoDados.css"

const LinkBancoDados = () => {
    const {dados, carregando} = useRequestDjango("http://localhost:8000/requestBaseDados/", 'Listar')

    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>

    return (
        <div>
            <h1> Links para download </h1>
            
            <div className="content">
                {dados.map((item, index) => (
                    <div className="linksYoutube">
                    <p>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <img src="/img/imgBtns/download.png" alt="download" className="imgBtn imgBtnDownload" />
                    </a>                    
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <img src="/img/imgBtns/remover.png" alt="remover" className="imgBtn imgBtnRemover" />
                    </a>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <img src="/img/imgBtns/youtube.png" alt="link" className="imgBtn imgBtnLink" />
                    </a>
                    </p>
                    <h6>{item.autor_link} - {item.titulo_link}</h6>
                    </div>                                
                ))}                
            </div>
            
        </div>
    );
};

export default LinkBancoDados

