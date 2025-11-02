/**  key= só utilizando que a lista não possui uma chave. */

import useRequestDjango from "./useRequestDjango";

const PlayerMidiasMp3 = ({ effectAtualizacao }) => {    
    const urlMiniatura = "http://localhost:8000/"
    const payload = {
        tipoMidia: 'MP3',
    }

    const {dados, carregando} = useRequestDjango("http://localhost:8000/listagem_midias/", payload, effectAtualizacao)

    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>

  return (
    <div className="divPrincipal">        
        <div className="content">
            <h3>Lista MP3</h3>
                {dados.map((item) => (
                    <div>
                        <div className="paragraphTitulos" key={item.id_music}>
                            <p>{item.nome_arquivo}</p> <p>{item.duracao_midia}</p>
                        </div>
                        <div>
                            <p>{`${urlMiniatura}${item.path_miniatura}`}</p>
                            <img src={`${urlMiniatura}${item.path_miniatura}`} alt="" />
                        </div>
                    </div>                     
                ))}            
        </div>        
    </div>
  );
};

export default PlayerMidiasMp3;