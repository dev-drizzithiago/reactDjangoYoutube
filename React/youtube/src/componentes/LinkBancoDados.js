// Para colocar um qualquer elemento de html, é preciso esta sempre dentro de uma tag<div> => exemplo
import useRequestDjango from "./useRequestDjango";
import sendRequestDjango from "./sendRequestDjango";

import "./LinkBancoDados.css"

import { useState, useEffect } from "react";

const LinkBancoDados = ({triggerAtualizacao}) => {    
    
    const [atualizacaoBaseLinks, setAtualizacaoBaseLinks] = useState(0)    
    const [downloadMidias, setdownloadMidias] = useState(null)

    useEffect(()=>{
        setAtualizacaoBaseLinks(triggerAtualizacao)
    }, [triggerAtualizacao])

    const {dados, carregando} = useRequestDjango("http://localhost:8000/requestBaseDados/", 'Listar', atualizacaoBaseLinks)

    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>

    /** Função para preparar o download tanto em video como em musicas mp3 */
    const downloadVideoAndMusic = async (id_dados) => {
        setdownloadMidias(id_dados)
        const dadosDownload = {
            id_dados: id_dados,
            midia: 'MP3',
        }
        const djangoUrlDownloads = "http://localhost:8000/download_link/"
        const responseDjangoDownload = await sendRequestDjango(djangoUrlDownloads, dadosDownload)

        console.log(responseDjangoDownload)
        setdownloadMidias(false)
    }

    const removeLinkBaseDados = async (id_dados) => {
        setdownloadMidias(id_dados)
        const dadosDelete = {id_dados: id_dados}
        const djangoUrlDownloads = "http://localhost:8000/remove_link/";
        const responseDjangoDownload = await sendRequestDjango(djangoUrlDownloads, dadosDelete);

        console.log(responseDjangoDownload);

        setAtualizacaoBaseLinks(prev => prev + 1);
        setdownloadMidias(false);
    }

    const playerMidiaSelecionada = () => {
        
    }

    return (
        <div>
            <h3> Links para download </h3>
            <div className="linkBancoDados-content">
                {dados.map((item) => (
                    <div className="linkBancoDados-linksYoutube" key={item.id_dados}>         
                        <div className="linkBancoDados-div_paragraphTitulos">
                            <p className='linkBancoDados-paragraphs'>{item.autor_link}</p> 
                            <p>{item.titulo_link}</p>
                        </div>

                        <div className="linkBancoDados-divImgMiniatura">
                            <img className="linkBancoDados-imgMiniatura" src={item.miniatura} alt="miniatura" />
                        </div>
                        
                        <p className="linkBancoDados-btnsAcao">
                            

                            <img src="/img/imgBtns/download.png" alt="download" className="linkBancoDados-imgBtn linkBancoDados-imgBtnDownload" 
                            onClick={() => downloadVideoAndMusic(item.id_dados)} aria-label={`Baixar mídia de ${item.titulo_link}`} />

                            <img src="/img/imgBtns/remover.png" alt="remover" className="linkBancoDados-imgBtn linkBancoDados-imgBtnRemover" onClick={() => removeLinkBaseDados(item.id_dados) } />

                            <a href={item.link_tube} target="_blank"><img src="/img/imgBtns/youtube.png" alt="link" className="linkBancoDados-imgBtn linkBancoDados-imgBtnLink"/></a>

                            {/*<div className="divImgLoading"><img  className="imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/></div>*/}

                            {/** && Use quando você só quer mostrar algo se a condição for verdadeira:
                               *  ? Use quando você quer mostrar uma coisa OU outra, dependendo da condição:*/}

                            {downloadMidias == item.id_dados && (<div className="linkBancoDados-divImgLoading"><img  className="linkBancoDados-imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/></div>)}
                        </p>                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LinkBancoDados

