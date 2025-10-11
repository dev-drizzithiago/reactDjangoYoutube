import { useState } from "react";
import LinkBancoDados from "./LinkBancoDados";

const EventsBtns = () => {
    const [mostrarLink, setMostrarLink] = useState(false)

    const eventoBtn = () => {
        setMostrarLink(true)
    }

    return (
        <div>
            <button onClick={eventoBtn}>aplicar</button>     
            {mostrarLink && <LinkBancoDados/>}       
        </div>
    );    
};

export default EventsBtns;