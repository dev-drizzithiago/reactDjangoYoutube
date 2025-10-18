// Para colocar um qualquer elemento de html, é preciso esta sempre dentro de uma tag<div> => exemplo
import useRequestDjango from "./useRequestDjango";

const LinkBancoDados = () => {
    
    const {dados, carregando} = useRequestDjango("http://localhost:3000/requestBaseDados/", {action: 'listar'})
   
    if (carregando) return <p>Carregando...</p>;

    return (
        <div>
            <h1>Teste</h1>            
            <div className="divLinkYoutube">
                {dados.map((item) => (
                    <div>
                        <p>
                            <a href={item.link_tube} target="_blank" rel="noopener noreferrer">
                                <img src="/img/imgBtns/download.png" alt="download" className="imgBtn imgBtnDownload" />
                            </a>                    
                            <a href={item.link_tube} target="_blank" rel="noopener noreferrer">
                                <img src="/img/imgBtns/remover.png" alt="remover" className="imgBtn imgBtnRemover" />
                            </a>
                            <a href={item.link_tube} target="_blank" rel="noopener noreferrer">
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

