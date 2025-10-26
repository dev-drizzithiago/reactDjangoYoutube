import './App.css';

import LogoYoutube from './componentes/LogoYoutube'
import FormularioLinkYoutube from './componentes/FormularioLinkYoutube';
import useRequestDjango from './componentes/useRequestDjango';
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
  const linkDjangoRequest = "http://localhost:8000/requestBaseDados/" 

  const [responseFormulario, setResponseFormulario] = useState(0)
  return (
    <div className="App">
      <div className='divPgPrincipal formsInputLink'>
        <FormularioLinkYoutube  onLinkAdicionado={() => setResponseFormulario(prev => prev + 1)} />
      </div>

      <div className='containePrincipal'>
        <useRequestDjango linkDjango={linkDjangoRequest} />
      </div>
    </div>
  );
}

export default App;


/** RAFCE Para criar uma estrutura no componentes */