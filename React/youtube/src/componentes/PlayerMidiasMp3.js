/**  key= só utilizando que a lista não possui uma chave. */

import useRequestDjango from "./useRequestDjango";

const PlayerMidiasMp3 = ({ effectAtualizacao }) => {    
    
    const payload = {
        tipoMidia: 'MP3',
    }

    const {responseDjango, carregando} = useRequestDjango("http://localhost:8000/listagem_midias/", payload, effectAtualizacao)

    console.log(responseDjango)

    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>

  return (
    <div>
        {responseDjango.map((item, index) => (
            <div className="paragraphTitulos" key={index.id_music}>
                <p>{item.nome_arquivo}</p> <p>{item.duracao_midia}</p>
            </div>
        ))}
    </div>
  );
};

export default PlayerMidiasMp3;