import { useState } from 'react'
import './PlayerMidias.css'

const urlDefaultDjango = `http://192.168.15.250:8080`

const PlayerMidias = ({executandoMidia, fecharPlayer}) => {
    const fecharPlayerMidia = () => {
      fecharPlayer()
    }

    return (
      <div className='play-divPrincipal'>
          <h1 className='play-titulo'> PLAYER DE MIDIAS</h1>          
            <video controls autoPlay className='play-divPlayerMidias'>
                <source src={encodeURI(`${urlDefaultDjango}/media/${executandoMidia[0]}`)} type={`${executandoMidia[1]}`}/>
            </video>
          <div className='play-divBtns'>
            <img src="/img/imgBtns/botao-fechar.png" alt="player" className="play-midia_imgBtn" onClick={fecharPlayerMidia} />
          </div>
      </div>
    )
}

export default PlayerMidias;