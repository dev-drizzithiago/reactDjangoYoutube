/**  key= só utilizando que a lista não possui uma chave. */

import { useState } from "react";

const PlayerMidiasMp3 = () => {

    const [listaMp3Salva] = useState(
        [1, 2, 3, 4, 5]
    )

  return (
    <div>
        <ul>
            {listaMp3Salva.map(
                (item, index) => (
                    <li key={index}>{item}</li>
                )
            )}
        </ul>
    </div>
  );
};

export default PlayerMidiasMp3;