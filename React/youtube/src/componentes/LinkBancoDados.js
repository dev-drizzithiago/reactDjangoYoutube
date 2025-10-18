// Para colocar um qualquer elemento de html, é preciso esta sempre dentro de uma tag<div> => exemplo
import { useState } from "react";

const LinkBancoDados = () => {

    const [meuNome] = useState([
        {
        'link_tube': 'https://www.google.com',
        'autor_link': 'Phil Collins - Topic',
        'titulo_link': 'Another Day in Paradise (2016 Remaster)',
        'duracao': '322',
        'miniatura': 'https://i.ytimg.com/vi/qkDVozHVeM8/sddefault.jpg'
        }, 

        {
        'link_tube': 'https://www.google.com',
        'autor_link': 'Phil Collins - Topic',
        'titulo_link': 'Another Day in Paradise (2016 Remaster)',
        'duracao': '322',
        'miniatura': 'https://i.ytimg.com/vi/qkDVozHVeM8/sddefault.jpg'
        }
    ])

    return (
        <div>
            <div className="divLinkYoutube">
                {meuNome.map((item) => (
                    <div><p>
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

