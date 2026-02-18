/**  key= só utilizando que a lista não possui uma chave. */
import { useEffect, useState } from 'react';
import './PlayerMidiasMp4.css'

import useRequestDjango from "./useRequestDjango";
import sendRequestDjango from './sendRequestDjango';
import { toast } from 'react-toastify';

const urlDefaultDjango = `http://192.168.15.250:8080`

const PlayerMidiasMp3 = ({ effectAtualizacao, executaMidia }) => {    
    const urlMiniatura = `${urlDefaultDjango}/media/`
    const payload = {tipoMidia: 'MP4'}

    const [atualizacaoModiaMp4, setAtualizacaoMidiaMp4] = useState(0)

    useEffect(()=>{
        setAtualizacaoMidiaMp4(effectAtualizacao)
    }, [effectAtualizacao])

    const {dados, carregando, usuarioLogado} = useRequestDjango(`${urlDefaultDjango}/listagem_midias/`, payload, atualizacaoModiaMp4);
    
    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>;
    
    const executarPlayerMidia = (linkMidia) => {
        console.log('Executando mídia..')

        /** Envia os dados para o elemento principal (app) */
        executaMidia(linkMidia, 'audio/mp4', true);
    }

    /** FUNÇÃO PARA DOWNLOAD DA MIDIA */
    const downloadMidia = async (midiaDownload) => {
        const payload = {
            'tipoDownload': 'mp4',
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
        const payload = {
            tipoMidia: 'MP4',
            idMidia: id_music
        }
        const responseDjango = await sendRequestDjango(`${urlDefaultDjango}/removendo_midias/`, payload);
        
        setAtualizacaoMidiaMp4(prev => prev + 1)

        if (responseDjango.erro_processo === 0){
            toast.success(responseDjango.mensagem_processo)
        } else if (responseDjango.erro_processo === 0) {
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
            <h3>Lista MP4</h3>           
            <div className="playerMidiasMp3-content">
                    {dados.map((item) => (
                        <div className="playerMidiasMp3-playMidias"  key={item.id_movies}>
                            <div className="playerMidiasMp3-div_paragraphTitulos">
                                <p className='playerMidiasMp3-paragraphs'>{item.nome_arquivo}</p> 
                                <p>{String.fromCodePoint(0x23F3)} {converterDuracao(item.duracao_midia)}</p>
                            </div>

                            <div>
                                <img className="playerMidiasMp3-imgMiniatura" src={`${urlMiniatura}${item.path_miniatura}`} alt="miniatura"  />
                            </div>

                            <div className="playerMidiasMp4-divBtnsAcao">
                                <img src="/img/imgBtns/botao-play.png" alt="player" className="playerMidiasMp4-imgBtn playerMidiasMp4-imgBtnLink" 
                                onClick={() => executarPlayerMidia(item.path_arquivo)} />

                                <img src="/img/imgBtns/download.png" alt="download" className="playerMidiasMp4-imgBtn playerMidiasMp4-imgBtnDownload" 
                                onClick={() => downloadMidia(item.path_arquivo)} />  

                                <img src="/img/imgBtns/remover.png" alt="remover" className="playerMidiasMp4-imgBtn playerMidiasMp4-imgBtnRemover" 
                                onClick={() => removeDeleteMidia(item.id_movies)} />

                                {/*<div className="divImgLoading"><img  className="imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/></div>*/}

                                {/** && Use quando você só quer mostrar algo se a condição for verdadeira:
                                 *  ? Use quando você quer mostrar uma coisa OU outra, dependendo da condição:*/}

                                {/*downloadMidias == item.id_dados && (<div className="divImgLoading"><img  className="imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/></div>)*/}
                            </div>
                        </div>                     
                    ))}            
            </div>
        </div>
    );
};

export default PlayerMidiasMp3;