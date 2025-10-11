import { useState } from "react";
import LinkBancoDados from "./LinkBancoDados";

const EventsBtns = () => {
    const [mostrarLink, setMostrarLink] = useState(false)

    const eventoBtn = () => {
       setMostrarLink(!mostrarLink);
    };

    return (
        <div>
            <button onClick={eventoBtn}>{mostrarLink ? 'Remover' : 'Aplicar'}</button>     
            {mostrarLink && <LinkBancoDados/>}
        </div>
    );    
};

export default EventsBtns;