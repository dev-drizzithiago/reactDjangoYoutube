import LinkBancoDados from "./LinkBancoDados";

const EventsBtns = () => {

    const eventoBtn = () => {
        alert('Clicou');
    }

    return (
        <div>
            <button onClick={eventoBtn}>aplicar</button>
        </div>
    );
};

export default EventsBtns;