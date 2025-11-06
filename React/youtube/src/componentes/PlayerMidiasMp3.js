/**  key= só utilizando que a lista não possui uma chave. */

import useRequestDjango from "./useRequestDjango";
import './PlayerMidiasMp3';

const PlayerMidiasMp3 = ({ effectAtualizacao }) => {    
    const urlMiniatura = "http://localhost:8000/media/"
    const payload = {
        tipoMidia: 'MP3',
    }

    const {dados, carregando} = useRequestDjango("http://localhost:8000/listagem_midias/", payload, effectAtualizacao)
    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>

    return (
        <div>
            <h3>Lista MP3</h3>
            <div className="content">
                    {dados.map((item) => (
                        <div className="playMidias"  key={item.id_music}>
                            <div className="paragraphTitulos">
                                <p>{item.nome_arquivo}</p> <p>{item.duracao_midia}</p>
                            </div>

                            <div>
                                <img className="imgMiniatura" src={`${urlMiniatura}${item.path_miniatura}`} alt="miniatura"  />
                            </div>

                            <p className="btnsAcao">
                                <img src="/img/imgBtns/botao-play.png" alt="player" className="imgBtn imgBtnLink" />
                                <img src="/img/imgBtns/download.png" alt="download" className="imgBtn imgBtnDownload" />                    
                                <img src="/img/imgBtns/remover.png" alt="remover" className="imgBtn imgBtnRemover" />

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