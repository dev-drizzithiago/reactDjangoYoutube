// Para colocar um qualquer elemento de html, é preciso esta sempre dentro de uma tag<div> => exemplo
import useRequestDjango from "./useRequestDjango";
import sendRequestDjango from "./sendRequestDjango";
import "./LinkBancoDados.css"

import { useState } from "react";

const LinkBancoDados = ({triggerAtualizacao}) => {
    const [SendDadosDownload, setSendDadosDownload] = useState(null)

    const {dados, carregando} = useRequestDjango("http://localhost:8000/requestBaseDados/", 'Listar', triggerAtualizacao)
    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>

    const downloadVideoAndMusic = async (link_tube, id_dados) => {
        const dadosDownload = {
            id_dados: id_dados,
            midia: 'MP4',
        }

        console.log(dadosDownload)
        const djangoUrlDownloads = "http://localhost:8000/download_link/"
        const responseDjangoDownload = await sendRequestDjango(djangoUrlDownloads, dadosDownload)

        console.log(responseDjangoDownload)
    }

    const removeLinkBaseDados = (link_tube) => {

    }

    return (
        <div>
            <h1> Links para download </h1>            
            <div className="content">
                {dados.map((item, index) => (
                    <div className="linksYoutube" key={item.id_dados}>         
                        <div>
                            <p>{item.id_dados}</p> <p>{item.autor_link}</p> <p>{item.titulo_link}</p>
                        </div>

                        <div className="divImgMiniatura">
                            <img className="imgMiniatura" src={item.miniatura} alt="miniatura" />
                        </div>
                        
                        <p className="paragraphTitulos">                            
                            
                        <img src="/img/imgBtns/download.png" alt="download" className="imgBtn imgBtnDownload" onClick={() => downloadVideoAndMusic(item.link_tube, item.id_dados)}  />
                    
                        <img src="/img/imgBtns/remover.png" alt="remover" className="imgBtn imgBtnRemover" onClick={() => removeLinkBaseDados(item.id_dados) } />

                        <a href={item.link_tube} target="_blank"><img src="/img/imgBtns/youtube.png" alt="link" className="imgBtn imgBtnLink"/></a>
                        
                            
                        </p>
                    </div>                                
                ))}                
            </div>
        </div>
    );
};

export default LinkBancoDados

