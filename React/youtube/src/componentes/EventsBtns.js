import { useState } from "react";
import LinkBancoDados from "./LinkBancoDados";

const EventsBtns = () => {
    const [MostrarLink, setMostrarLink] = useState(false);
    const EventoBtn = () => setMostrarLink(!MostrarLink);

    return (
        <div>
            <button onClick={EventoBtn}> 
                {MostrarLink ? 'Remover' : 'Aplicar'}                
            </button>

            <div className="playerMusic">
                {MostrarLink && <LinkBancoDados/>}
            </div>
        </div>
    );    
};

export default EventsBtns;
