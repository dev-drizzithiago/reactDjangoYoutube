// Para colocar um qualquer elemento de html, é preciso esta sempre dentro de uma tag<div> => exemplo
import useRequestDjango from "./useRequestDjango";
import "./LinkBancoDados.css"
import { useEffect } from "react";

const LinkBancoDados = ({triggerAtualizacao}) => {

    const {dados, carregando} = useRequestDjango("http://localhost:8000/requestBaseDados/", 'Listar', triggerAtualizacao)
    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>

    return (
        <div>
            <h1> Links para download </h1>            
            <div className="content">
                {dados.map((item, index) => (
                    <div className="linksYoutube" key={index}>         
                        <div>
                            <p>{item.autor_link}</p> <p>{item.titulo_link}</p>
                        </div>
                        
                        <p className="paragraphTitulos">
                            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="Baixar vídeo">
                                <img src="/img/imgBtns/download.png" alt="download" className="imgBtn imgBtnDownload" />
                            </a>                    
                            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="Remover">
                                <img src="/img/imgBtns/remover.png" alt="remover" className="imgBtn imgBtnRemover" />
                            </a>
                            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="Acessar site">
                                <img src="/img/imgBtns/youtube.png" alt="link" className="imgBtn imgBtnLink" />
                            </a>
                        </p>
                    </div>                                
                ))}                
            </div>
        </div>
    );
};

export default LinkBancoDados

