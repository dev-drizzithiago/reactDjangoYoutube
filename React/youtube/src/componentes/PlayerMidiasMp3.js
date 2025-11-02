/**  key= só utilizando que a lista não possui uma chave. */

import useRequestDjango from "./useRequestDjango";

const PlayerMidiasMp3 = ({ effectAtualizacao }) => {    
    
    const payload = {
        tipoMidia: 'MP3',
    }

    const {dados, carregando} = useRequestDjango("http://localhost:8000/listagem_midias/", payload, effectAtualizacao)

    console.log(dados)

    if (carregando) return <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>

  return (
    <div>
        <h3>Lista MP3</h3>
        {dados.map((item) => (
            <div className="paragraphTitulos" key={item.id_music}>
                <p>{item.nome_arquivo}</p> <p>{item.duracao_midia}</p>
            </div>
        ))}
    </div>
  );
};

export default PlayerMidiasMp3;