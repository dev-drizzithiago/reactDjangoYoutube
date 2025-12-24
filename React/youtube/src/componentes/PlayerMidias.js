import './PlayerMidias.css'
const PlayerMidias = ({executandoMidia, fecharPlayer}) => {

    const fecharPlayerMidia = () => {
      console.log('Fechar Player')
      fecharPlayer()
    }

    console.log(encodeURI(`http://localhost:8000/media/${executandoMidia[0]}`))

    return (
      <div>
          <h1> PLAYER DE MIDIAS</h1>
            <video controls className='playerMidias'>
                <source src={encodeURI(`http://localhost:8000/media/${executandoMidia[0]}`)} type={`audio/${executandoMidia[1]}`}/>
            </video>

          <img src="/img/imgBtns/botao-fechar.png" alt="player" className="player-midia-imgBtn" onClick={fecharPlayerMidia} />
          
      </div>
    )
}

export default PlayerMidias;