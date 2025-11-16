
export const PlayerMidias = ({executandoMidia}) => {

    console.log(executandoMidia)

  return (
    <div>
        <h1> PLAYER DE MIDIAS</h1>
        <video width="500px" height="600px">
            <source src={executandoMidia[0]} type={executandoMidia[1]}/>
        </video>        
    </div>
  )
}

export default PlayerMidias;