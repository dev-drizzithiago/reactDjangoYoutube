/**  key= só utilizando que a lista não possui uma chave. */

import { useState } from "react";

const PlayerMidiasMp3 = () => {
    const [dadosMidiasLista, setDados] = useState([])


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