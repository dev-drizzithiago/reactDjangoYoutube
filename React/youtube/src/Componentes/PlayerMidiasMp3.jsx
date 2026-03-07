/**  key= só utilizando que a lista não possui uma chave. */
import { useEffect, useState } from 'react';
import './PlayerMidiasMp3.css'

import useRequestDjango from "./useRequestDjango";
import sendRequestDjango from './sendRequestDjango';

import { toast } from 'react-toastify';

import { TbPlayerPlay } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";

// PADRÃO PARA A URL 
const urlDefaultDjango = `http://192.168.15.250:8080`

const PlayerMidiasMp3 = ({ effectAtualizacao, executaMidia, fechaElementoMp3 }) => {    
    const urlMiniatura = `${urlDefaultDjango}/media/`
    const payload = {tipoMidia: 'MP3'}

    const [atualizacaoModiaMp3, setAtualizacaoMidiaMp3] = useState(0)
    

    useEffect(()=>{
        setAtualizacaoMidiaMp3(effectAtualizacao)        
    }, [effectAtualizacao])

    const { dados, carregando } = useRequestDjango(`${urlDefaultDjango}/listagem_midias/`, payload, atualizacaoModiaMp3);    
           
    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>;

    const executarPlayerMidia = (linkMidia) => {
        console.log('Executando mídia...')
        toast.success('Executando mídia...')

        /** Envia os dados para o elemento principal (app) */
        executaMidia(linkMidia, 'audio/mp3');
    }

    /** FUNÇÃO PARA DOWNLOAD DA MIDIA */
    const downloadMidia = async (midiaDownload) => {
        console.log('Download da mídia..')
        
        const payload = {
            'tipoDownload': 'mp3',
            'linkDownload': midiaDownload,
        }

        const response = await sendRequestDjango(`${urlDefaultDjango}/preparar_midias_to_download/`, payload);
        
        if (response && response.download_url) {
            setTimeout(() => {
                const url = encodeURI(`${urlDefaultDjango}${response.download_url}`)
                window.open(url, "_blank", "width=600 height=400");                
            }, 1000);
        }        
   }

    const removeDeleteMidia = async (id_music) => {
        console.log('Removendo a mídia..')

        const payload = {
            tipoMidia: 'MP3',
            idMidia: id_music
        }
        
        // Faz a requisição para o Django para remover a mídia, e aguarda a resposta.
        const responseDjango = await sendRequestDjango(`${urlDefaultDjango}/removendo_midias/`, payload);        

        if (responseDjango.erro_processo === 0) {
            toast.success(responseDjango.mensagem_processo)

            // Atualiza a lista de mídias após a remoção, incrementando o estado para disparar o useEffect.
            setAtualizacaoMidiaMp3(prev => prev + 1)

            // Fecha o elemento de player de MP3 após a remoção da mídia.
            // fechaElementoMp3(false)

        } else if (responseDjango.erro_processo === 1) {
            toast.error(responseDjango.mensagem_processo)
        }
    }

    function converterDuracao(duracao) {
        const minutos = Math.round(duracao / 60); // converte o valor inteiro para minutos.
        const segundos = duracao % 60;  // converte o valor inteiro para segundos.
        return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    }

    return (
        <div>
            {dados && dados.length ? <>
            <h3>Lista MP3</h3>
            <div className="playerMidiasMp3-content">
                
                {dados.map((item) => (
                    <div className="playerMidiasMp3-playMidias"  key={item.id_music}>
                        <div className="playerMidiasMp3-div_paragraphTitulos">
                            <p className='playerMidiasMp3-paragraphs'>{item.nome_arquivo}</p> 
                            <p>{String.fromCodePoint(0x23F3)} {converterDuracao(item.duracao_midia)}</p>
                        </div>

                        <div>
                            <img className="playerMidiasMp3-imgMiniatura" src={`${urlMiniatura}${item.path_miniatura}`} alt="miniatura"  />
                        </div>

                        <div className="playerMidiasMp3-divBtnsAcao">
                            <TbPlayerPlay 
                            className="playerMidiasMp3-imgBtn playerMidiasMp3-imgBtnLink" 
                            onClick={() => executarPlayerMidia(item.path_arquivo)} />

                            <FaDownload 
                            className="playerMidiasMp3-imgBtn playerMidiasMp3-imgBtnDownload" 
                            onClick={() => downloadMidia(item.path_arquivo)} />  

                            <RiDeleteBin6Line 
                            className="playerMidiasMp3-imgBtn playerMidiasMp3-imgBtnRemover" 
                            onClick={() => removeDeleteMidia(item.id_music)} />
                        </div>
                    </div>                     
                ))}            
            </div>
            </> : <h3> Você não possui nenhum MP3 baixado. </h3>}
        </div>
    );
};

export default PlayerMidiasMp3;