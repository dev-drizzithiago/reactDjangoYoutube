import { useState } from "react";

export const PlayerMidias = ({linkMidia, tipoMidia}) => {

  return (
    <div>
        <h1> PLAYER DE MIDIAS</h1>
        <video width="500px" height="600px">
            <source src={linkMidia} type={tipoMidia}/>
        </video>        
    </div>
  )
}

export default PlayerMidias;