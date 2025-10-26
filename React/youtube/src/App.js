import './App.css';

import LogoYoutube from './componentes/LogoYoutube'
import FormularioLinkYoutube from './componentes/FormularioLinkYoutube';
import LinkBancoDados from './componentes/LinkBancoDados';
import useCsrfInit from './componentes/useCsrfInit';

import { useState } from 'react';

function App() {
  {/**- Tudo fora do return (dentro da função do componente) 
    é onde você coloca lógica, hooks, variáveis, chamadas de API, etc.
 */}

  /** Recebe um GET do django com o cookies */
  useCsrfInit();
  {/** - Tudo dentro do return é JSX, ou seja, a 
    estrutura visual que será renderizada na tela.*/}

  const [responseFormulario, setResponseFormulario] = useState(0)
  console.log(responseFormulario)
  
  return (
    <div className="App">
      <div className='divPgPrincipal formsInputLink'>
        <FormularioLinkYoutube  onLinkAdicionado={() => setResponseFormulario(prev => prev + 1)} />
      </div>

      <div className='containePrincipal'>
        <div className='divPgPrincipal viewLinksyoutube'>
          <LinkBancoDados atualizar={responseFormulario} />
          {console.log(responseFormulario)}
        </div>
      </div>
    </div>
  );
}

export default App;


/** RAFCE Para criar uma estrutura no componentes */