import './App.css';
import useCsrfInit from './componentes/useCsrfInit';
import { useState } from 'react';

import FormularioLinkYoutube from './componentes/FormularioLinkYoutube';
import LinkBancoDados from './componentes/LinkBancoDados';
import PlayerMidiasMp3 from './componentes/PlayerMidiasMp3';


function App() {
  {/**- Tudo fora do return (dentro da função do componente) 
    é onde você coloca lógica, hooks, variáveis, chamadas de API, etc.
 */}

  /** Recebe um GET do django com o cookies */
  useCsrfInit();
  {/** - Tudo dentro do return é JSX, ou seja, a 
    estrutura visual que será renderizada na tela.*/}
  
  const [atualizarBanco, setAtualizarBanco] = useState(0);

  return (
    <div className="App">
      {/**<img src="/img/imgBtns/pasta_links.png" alt="links" className="imgBtn btnAdd" />
      <img src="/img/imgBtns/mp3.png" alt="adicionar" className="imgBtn btnLimpar" />   
      <img src="/img/imgBtns/mp4.png" alt="adicionar" className="imgBtn btnLimpar" />  */}
        
       
          <FormularioLinkYoutube onLinkAdicionado={() => setAtualizarBanco(prev => prev + 1)} />

          <div className='app-divBtnImg'>
            <img src="/img/imgBtns/mp3.png" alt="player" className="app-imgBtn" />
            <img src="/img/imgBtns/mp4.png" alt="player" className="app-imgBtn" />
          </div>
          

          <div className='app-divLinksMidias'>
            <LinkBancoDados triggerAtualizacao={atualizarBanco} />
            <PlayerMidiasMp3 />
          </div>
          
       
    </div>
  );
}

export default App;


/** RAFCE Para criar uma estrutura no componentes */