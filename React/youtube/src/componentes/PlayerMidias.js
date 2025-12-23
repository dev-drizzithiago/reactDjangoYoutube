import './PlayerMidias.css'
const PlayerMidias = ({executandoMidia, fecharPlayer}) => {

    const fecharPlayerMidia = () => {
      console.log('Fechar Player')
      fecharPlayer()
    }

    console.log(`http://localhost:8000/media/${executandoMidia[0]}`)

    return (
      <div>
          <h1> PLAYER DE MIDIAS</h1>
            <video controls width="500px" height="600px" className='playerMidias'>
                <source src={`http://localhost:8000/media/${executandoMidia[0]}`} type={executandoMidia[1]}/>
            </video>

          <img src="/img/imgBtns/botao-fechar.png" alt="player" className="player-midia-imgBtn" onClick={fecharPlayerMidia} />
          
      </div>
    )
}

export default PlayerMidias;