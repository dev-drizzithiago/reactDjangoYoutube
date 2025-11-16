/**  key= só utilizando que a lista não possui uma chave. */
import { useEffect, useState } from 'react';
import './PlayerMidiasMp3.css'

import useRequestDjango from "./useRequestDjango";


const PlayerMidiasMp3 = ({ effectAtualizacao }) => {    
    const urlMiniatura = "http://localhost:8000/media/"
    const payload = {
        tipoMidia: 'MP3',
    }
    
    const [atualizacaoModiaMp3, setAtualizacaoMidiaMp3] = useState(0)
    useEffect(()=>{
        setAtualizacaoMidiaMp3(effectAtualizacao)
    }, [effectAtualizacao])

    const {dados, carregando} = useRequestDjango("http://localhost:8000/listagem_midias/", payload, atualizacaoModiaMp3)
    console.log(dados)
    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>


    const processoPlayerMidia = () => {
        console.log('Executando mídia..')
    }

    const downloadMidia = () => {
        console.log('Download da mídia..')
    }

    const removeDeleteMidia = () => {
        console.log('Removendo a mídia..')
    }


    return (
        <div>
            <h3>Lista MP3</h3>
            <div className="playerMidiasMp3-content">
                    {dados.map((item) => (
                        <div className="playerMidiasMp3-playMidias"  key={item.id_music}>
                            <div className="playerMidiasMp3-div_paragraphTitulos">
                                <p className='playerMidiasMp3-paragraphs'>{item.nome_arquivo}</p> 
                                <p>{item.duracao_midia}</p>
                            </div>

                            <div>
                                <img className="playerMidiasMp3-imgMiniatura" src={`${urlMiniatura}${item.path_miniatura}`} alt="miniatura"  />
                            </div>

                            <p className="playerMidiasMp3-btnsAcao">
                                <img src="/img/imgBtns/botao-play.png" alt="player" className="playerMidiasMp3-imgBtn playerMidiasMp3-imgBtnLink" 
                                onClick={() => processoPlayerMidia(item.path_arquivo)} />

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
            </div>        
        </div>
    );
};

export default PlayerMidiasMp3;