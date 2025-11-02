/**  key= só utilizando que a lista não possui uma chave. */

import { useState } from "react";
import useRequestDjango from "./useRequestDjango";

const PlayerMidiasMp3 = ({ effectAtualizacao }) => {    
    const urlDjango = "/listagem_midias/"
    const payload = {
        tipoMidia: 'MP3',
    }
    const [dadosDjango, setDadosDjango] = useRequestDjango(urlDjango, payload, effectAtualizacao)

  return (
    <div>
        {dadosMidiasLista.map((item) => (
            <div className="paragraphTitulos">
                <p>{item.autor_link}</p> <p>{item.titulo_link}</p>
            </div>
        ))}
    </div>
  );
};

export default PlayerMidiasMp3;