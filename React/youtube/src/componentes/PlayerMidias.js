import './PlayerMidias.css'
const PlayerMidias = ({executandoMidia, fecharPlayer}) => {

    const fecharPlayerMidia = () => {
      console.log('Fechar Player')
      fecharPlayer()
    }

  return (
    <div>
        <h1> PLAYER DE MIDIAS</h1>
        <video width="500px" height="600px">
            <source src={executandoMidia[0]} type={executandoMidia[1]}/>
        </video>
        

        <img src="/img/imgBtns/botao-fechar.png" alt="player" className="player-midia-imgBtn" onClick={fecharPlayerMidia} />
        
    </div>
  )
}

export default PlayerMidias;