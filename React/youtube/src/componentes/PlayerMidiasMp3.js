/**  key= só utilizando que a lista não possui uma chave. */
import { useEffect, useState } from 'react';
import './PlayerMidiasMp3.css'

import useRequestDjango from "./useRequestDjango";
import sendRequestDjango from './sendRequestDjango'
import LoginUsuario from './LoginUsuario';

const PlayerMidiasMp3 = ({ effectAtualizacao, executaMidia }) => {    
    const urlMiniatura = "http://localhost:8000/media/"
    const payload = {tipoMidia: 'MP3'}

    const [statusLogin, setStatusLogin] = useState(false)    
    const [atualizacaoModiaMp3, setAtualizacaoMidiaMp3] = useState(0)

    useEffect(()=>{
        setAtualizacaoMidiaMp3(effectAtualizacao)
    }, [effectAtualizacao])

    const {dados, carregando, usuarioLogado} = useRequestDjango("http://localhost:8000/listagem_midias/", payload, atualizacaoModiaMp3);

    useEffect(() => {
        if(statusLogin) {
            setAtualizacaoMidiaMp3(prev => prev + 1)
        }
    }, [statusLogin])

    useEffect(()=>{
        if (usuarioLogado) {
            setStatusLogin(usuarioLogado)
        }
    }, [usuarioLogado])

    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>;
    
    const executarPlayerMidia = (linkMidia) => {
        console.log('Executando mídia..')

        /** Envia os dados para o elemento principal (app) */
        executaMidia(linkMidia, 'mp3');
    }

    /** FUNÇÃO PARA DOWNLOAD DA MIDIA */
    const downloadMidia = async (midiaDownload) => {
        console.log('Download da mídia..')

        const payload = {
            'tipoDownload': 'mp3',
            'linkDownload': midiaDownload,
        }

        const response = await sendRequestDjango("http://localhost:8000/preparar_midias_to_download/", payload);
        
        if (response && response.download_url) {            
            setTimeout(() => {
                const url = `http://localhost:8000${response.download_url}`
                window.open(url, "_blank", "width=600 height=400");                
            }, 1000);
        }
   }

    const removeDeleteMidia = () => {
        console.log('Removendo a mídia..')
    }

    function converterDuracao(duracao) {
        const minutos = Math.round(duracao / 60); // converte o valor inteiro para minutos.
        const segundos = duracao % 60;  // converte o valor inteiro para segundos.
        return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    }

    return (
        <div>
            <h3>Lista MP3</h3>
            {statusLogin ? 
            <div className="playerMidiasMp3-content">
                    {dados.map((item) => (
                        <div className="playerMidiasMp3-playMidias"  key={item.id_music}>
                            <div className="playerMidiasMp3-div_paragraphTitulos">
                                <p className='playerMidiasMp3-paragraphs'>{item.nome_arquivo}</p> 
                                <p>{String.fromCodePoint(0x23F3)} - {converterDuracao(item.duracao_midia)}</p>
                            </div>

                            <div>
                                <img className="playerMidiasMp3-imgMiniatura" src={`${urlMiniatura}${item.path_miniatura}`} alt="miniatura"  />
                            </div>

                            <p className="playerMidiasMp3-btnsAcao">
                                <img src="/img/imgBtns/botao-play.png" alt="player" className="playerMidiasMp3-imgBtn playerMidiasMp3-imgBtnLink" 
                                onClick={() => executarPlayerMidia(item.path_arquivo)} />

                                <img src="/img/imgBtns/download.png" alt="download" className="playerMidiasMp3-imgBtn playerMidiasMp3-imgBtnDownload" 
                                onClick={() => downloadMidia(item.path_arquivo)} />  

                                <img src="/img/imgBtns/remover.png" alt="remover" className="playerMidiasMp3-imgBtn playerMidiasMp3-imgBtnRemover" 
                                onClick={() => removeDeleteMidia(item.path_arquivo)} />

                                {/*<div className="divImgLoading"><img  className="imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/></div>*/}

                                {/** && Use quando você só quer mostrar algo se a condição for verdadeira:
                                 *  ? Use quando você quer mostrar uma coisa OU outra, dependendo da condição:*/}

                                {/*downloadMidias == item.id_dados && (<div className="divImgLoading"><img  className="imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/></div>)*/}
                            </p>
                        </div>                     
                    ))}            
            </div> :
            <LoginUsuario infoStatusLogin={(returnStatusLogin) => setStatusLogin(returnStatusLogin)}/>
            }
                    
        </div>
    );
};

export default PlayerMidiasMp3;