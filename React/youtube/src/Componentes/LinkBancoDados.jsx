// Para colocar um qualquer elemento de html, é preciso esta sempre dentro de uma tag<div> => exemplo
import useRequestDjango from "./useRequestDjango";
import sendRequestDjango from "./sendRequestDjango";

import "./LinkBancoDados.css"
import { useState, useEffect } from "react";

import { toast } from "react-toastify";

const urlDefaultDjango = `http://192.168.15.250:8080`

const LinkBancoDados = ({ propsStatusProcesso }) => {

    const [atualizacaoBaseLinks, setAtualizacaoBaseLinks] = useState(0);
    const [downloadMidias, setdownloadMidias] = useState(null);

    useEffect(()=>{
        setAtualizacaoBaseLinks(propsStatusProcesso)
    }, [propsStatusProcesso])    

    const {dados, carregando, usuarioLogado} = useRequestDjango(`${urlDefaultDjango}/requestBaseDados/`, 'Listar', atualizacaoBaseLinks)

    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..." className="linkBanco-loading"/>

    /** Função para preparar o download tanto em video como em musicas mp3 */
    const downloadVideoAndMusic = async (id_dados, tipoMidia) => {
        setdownloadMidias(id_dados)

        const dadosDownload = {
            id_dados: id_dados,
            midia: tipoMidia,
        }

        const djangoUrlDownloads = `${urlDefaultDjango}/download_link/`
        const responseDjangoDownload = await sendRequestDjango(djangoUrlDownloads, dadosDownload)

        if (responseDjangoDownload.mensagem === "Midia já existe.") {
            toast.warning("Midia já existe.")
        } else if (responseDjangoDownload.mensagem === "Download da mídia concluido com sucesso.") {
            toast.success("Download da mídia concluido com sucesso.")
        }  else if (responseDjangoDownload.erro_processo === 1) {
            toast.error('Erro ao fazer o download da mídia')
        }
        
        setdownloadMidias(false)

        setTimeout(() => {
            setAtivarMensagem(false)
        }, 60000)
    }

    const removeLinkBaseDados = async (id_dados) => {
        setdownloadMidias(id_dados)
        const dadosDelete = {id_dados: id_dados}
        const djangoUrlDownloads = `${urlDefaultDjango}/remove_link/`;
        const responseDjangoDownload = await sendRequestDjango(djangoUrlDownloads, dadosDelete);

        console.log(responseDjangoDownload);

        setAtualizacaoBaseLinks(prev => prev + 1);
        setdownloadMidias(false);
    }
    
    return (        
        <div>
            {/** Chama o formulário e envia uma confirmação quando o link for atualizado. */}       
            
            {dados && dados.length ? <>
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
                        
                        <div className="linkBancoDados-btnsAcao">

                            <img src="/img/imgBtns/download_mp3.png" alt="downloadMp3" className="linkBancoDados-imgBtn linkBancoDados-imgBtnDownload" 
                            onClick={() => downloadVideoAndMusic(item.id_dados, 'MP3')} aria-label={`Baixar mídia de ${item.titulo_link}`} />

                            <img src="/img/imgBtns/download_mp4.png" alt="downloadMp4" className="linkBancoDados-imgBtn linkBancoDados-imgBtnDownload" 
                            onClick={() => downloadVideoAndMusic(item.id_dados, 'MP4')} aria-label={`Baixar mídia de ${item.titulo_link}`} />

                            <img src="/img/imgBtns/remover.png" alt="remover" className="linkBancoDados-imgBtn linkBancoDados-imgBtnRemover" onClick={() => removeLinkBaseDados(item.id_dados) } />

                            <a href={item.link_tube} target="_blank"><img src="/img/imgBtns/youtube.png" alt="link" className="linkBancoDados-imgBtn linkBancoDados-imgBtnLink"/></a>

                            {downloadMidias == item.id_dados && (
                                <div className="linkBancoDados-divImgLoading">
                                    <img  className="linkBancoDados-imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/>
                                </div>
                            )}
                        </div>                        
                    </div>
                ))}
            </div></> : <h3> Não foram encontrados registro de links na base de dados. </h3>}
        </div>
    );
};

export default LinkBancoDados

