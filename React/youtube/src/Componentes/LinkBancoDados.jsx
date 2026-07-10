// Para colocar um qualquer elemento de html, é preciso esta sempre dentro de uma tag<div> => exemplo
import useRequestDjango from "./useRequestDjango";
import sendRequestDjango from "./sendRequestDjango";

import "./LinkBancoDados.css"
import { useState, useEffect } from "react";

import { toast } from "react-toastify";

// Importação dos ícones para os botões de download e remoção.
import { BsFiletypeMp4 } from "react-icons/bs";
import { BsFiletypeMp3 } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SiYoutubekids } from "react-icons/si";

import { urlDefaultDjango } from "../urls";

const LinkBancoDados = ({ propsStatusProcesso }) => {

    const [atualizacaoBaseLinks, setAtualizacaoBaseLinks] = useState(0);
    const [downloadMidias, setdownloadMidias] = useState(null);

    useEffect(()=>{
        setAtualizacaoBaseLinks(propsStatusProcesso)
    }, [propsStatusProcesso])    

    const {dados, carregando, usuarioLogado} = useRequestDjango(`${urlDefaultDjango}/requestBaseDados/`, 'Listar', atualizacaoBaseLinks)

    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..." className="linkBanco-loading"/>

    /**
     * Prepara e dispara o download de um link salvo, tanto em vídeo (MP4) quanto em música (MP3).
     * @param {number} id_dados - ID do link salvo que será baixado.
     * @param {string} tipoMidia - Tipo da mídia desejada ('MP3' ou 'MP4').
     * @returns {Promise<void>}
     */
    const downloadVideoAndMusic = async (id_dados, tipoMidia) => {

        // Evita que o usuário inicie um novo download enquanto outro processo de download estiver em andamento.
        if (downloadMidias) {
            toast.info("Aguarde o processo atual finalizar para iniciar um novo download.")
            return;
        }

        setdownloadMidias(id_dados)

        const dadosDownload = {
            id_dados: id_dados,
            midia: tipoMidia,
        }

        const djangoUrlDownloads = `${urlDefaultDjango}/download_link/`;
        const responseDjangoDownload = await sendRequestDjango(djangoUrlDownloads, dadosDownload);

        const erroProcesso = responseDjangoDownload.dados_json.erro_processo;
        const mensagemProcesso = responseDjangoDownload.dados_json.mensagem_processo;
              
        if (erroProcesso === 0) {
            toast.success(mensagemProcesso)
        } else if (erroProcesso === 1) {
            toast.error(mensagemProcesso)
        }

        setdownloadMidias(false)
    }

    /**
     * Remove um link salvo na base de dados e atualiza a lista exibida.
     * @param {number} id_dados - ID do link a ser removido.
     * @returns {Promise<void>}
     */
    const removeLinkBaseDados = async (id_dados) => {

        // Eveita que o usuário inicie um novo processo de remoção enquanto outro processo de download ou remoção estiver em andamento.
        if (downloadMidias) {
            toast.info("Aguarde o processo atual para remover o link.")
            return;
        }

        setdownloadMidias(id_dados)

        const dadosDelete = {id_dados: id_dados}
        const djangoUrlDownloads = `${urlDefaultDjango}/remove_link/`;

        const responseDjango = await sendRequestDjango(djangoUrlDownloads, dadosDelete);

        if (responseDjango.erro_processo === 0) {
            toast.success(responseDjango.mensagem_processo);
        } else {
            toast.error(responseDjango.mensagem_processo);
        }

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

                            <BsFiletypeMp3 
                            className="linkBancoDados-imgBtn linkBancoDados-imgBtnDownload" 
                            onClick={() => downloadVideoAndMusic(item.id_dados, 'MP3')} 
                            aria-label={`Baixar mídia de ${item.titulo_link}`} />

                            <BsFiletypeMp4  className="linkBancoDados-imgBtn linkBancoDados-imgBtnDownload" 
                            onClick={() => downloadVideoAndMusic(item.id_dados, 'MP4')} 
                            aria-label={`Baixar mídia de ${item.titulo_link}`} />

                            <RiDeleteBin6Line 
                            className="linkBancoDados-imgBtn linkBancoDados-imgBtnRemover" 
                            onClick={() => removeLinkBaseDados(item.id_dados) } />

                            <a href={item.link_tube} target="_blank">
                                <SiYoutubekids className="linkBancoDados-imgBtn linkBancoDados-imgBtnLink"/>
                            </a>

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

