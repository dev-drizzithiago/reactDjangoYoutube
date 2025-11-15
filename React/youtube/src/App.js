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
  const [elementoSelecionado, setElementoSelecionado] = useState(0)

  const linksSalvos = () => {
    console.log('Links')
    setElementoSelecionado(1)
  }
  const midiasMp3 = () => {
    console.log('MP3')
    setElementoSelecionado(2)
  }
  const midiasMp4 = () => {
    console.log('MP4')
    setElementoSelecionado(3)
  }

  return (
    <div className="App">

          
          <FormularioLinkYoutube onLinkAdicionado={() => setAtualizarBanco(prev => prev + 1)} />

          <div className='app-divBtnImg'>
            <img src="/img/imgBtns/pasta_links.png" alt="player" className="app-imgBtn" onClick={linksSalvos} />
            <img src="/img/imgBtns/mp3.png"         alt="player" className="app-imgBtn" onClick={midiasMp3}   />
            <img src="/img/imgBtns/mp4.png"         alt="player" className="app-imgBtn" onClick={midiasMp4}   />
          </div>

          {elementoSelecionado === 1 && <LinkBancoDados triggerAtualizacao={atualizarBanco} />}
          {elementoSelecionado === 2 && <PlayerMidiasMp3 />}

          
          
          
          
       
    </div>
  );
}

export default App;


/** RAFCE Para criar uma estrutura no componentes */