// Para colocar um qualquer elemento de html, é preciso esta sempre dentro de uma tag<div> => exemplo
import useRequestDjango from "./useRequestDjango";
import sendRequestDjango from "./sendRequestDjango";

import "./LinkBancoDados.css"
import { useState, useEffect } from "react";

const urlDefaultDjango = `http://192.168.15.250:8080`

const LinkBancoDados = ({ propsStatusProcesso }) => {

    const [atualizacaoBaseLinks, setAtualizacaoBaseLinks] = useState(0);
    const [downloadMidias, setdownloadMidias] = useState(null);
    const [ativarMensagem, setAtivarMensagem] = useState(false)
    const [mensagemProcesso, setMensagemProcesso] = useState('')
    const [imgStatus, setImgStatus] = useState(null)
    const [listaVazia, setListaVazia] = useState(false)

    useEffect(()=>{
        setAtualizacaoBaseLinks(propsStatusProcesso)
    }, [propsStatusProcesso])    

    const {dados, carregando, usuarioLogado} = useRequestDjango(`${urlDefaultDjango}/requestBaseDados/`, 'Listar', atualizacaoBaseLinks)

    useEffect(() => {
        if (dados.length > 0){
            setListaVazia(true)
        }
    }, [])
   
    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..." className="linkBanco-loading"/>

    /** Função para preparar o download tanto em video como em musicas mp3 */
    const downloadVideoAndMusic = async (id_dados, tipoMidia) => {
        setdownloadMidias(id_dados)
        setAtivarMensagem(false)

        const dadosDownload = {
            id_dados: id_dados,
            midia: tipoMidia,
        }

        const djangoUrlDownloads = `${urlDefaultDjango}/download_link/`
        const responseDjangoDownload = await sendRequestDjango(djangoUrlDownloads, dadosDownload)

        if (responseDjangoDownload.mensagem === "Midia já existe.") {
            setMensagemProcesso("Midia já existe.")
            setAtivarMensagem(id_dados)
            setImgStatus('/img/imgLogos/alerta.png')
        } else if (responseDjangoDownload.mensagem === "Download da mídia concluido com sucesso.") {
            setMensagemProcesso("Download da mídia concluido com sucesso.")
            setAtivarMensagem(id_dados)
            setImgStatus('/img/imgLogos/confirmado.png')
        }  else if (responseDjangoDownload.erro_processo === 1) {
            setMensagemProcesso('Erro ao fazer o download da mídia')
            setAtivarMensagem(id_dados)
            setImgStatus('/img/imgLogos/error.png')
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
            
            {listaVazia ? <>
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

                            {/*<div className="divImgLoading"><img  className="imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/></div>*/}

                            {/** && Use quando você só quer mostrar algo se a condição for verdadeira:
                               *  ? Use quando você quer mostrar uma coisa OU outra, dependendo da condição:*/}

                            {downloadMidias == item.id_dados && (
                                <div className="linkBancoDados-divImgLoading">
                                    <img  className="linkBancoDados-imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/>
                                </div>
                            )}

                            {ativarMensagem == item.id_dados && (<img className="linkBancoDados-msgAlerta" src={imgStatus} title={mensagemProcesso}/>)
                            }
                        </div>                        
                    </div>
                ))}
            </div></> : <h3> Não foram encontrados registro de links na base de dados. </h3>}
        </div>
    );
};

export default LinkBancoDados

