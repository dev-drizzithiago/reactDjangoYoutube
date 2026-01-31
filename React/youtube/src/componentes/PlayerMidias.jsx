import { useState } from 'react'
import './PlayerMidias.css'

const urlDefaultDjango = "http://localhost:8080"

const PlayerMidias = ({executandoMidia, fecharPlayer}) => {
    const fecharPlayerMidia = () => {
      fecharPlayer()
    }

    return (
      <div>
          <h1> PLAYER DE MIDIAS</h1>          
            <video controls className='playerMidias'>
                <source src={encodeURI(`${urlDefaultDjango}/media/${executandoMidia[0]}`)} type={`${executandoMidia[1]}`}/>
            </video>
          <img src="/img/imgBtns/botao-fechar.png" alt="player" className="player-midia-imgBtn" onClick={fecharPlayerMidia} />
      </div>
    )
}

export default PlayerMidias;