import './App.css';

import FormularioLinkYoutube from './componentes/FormularioLinkYoutube';
import LinkBancoDados from './componentes/LinkBancoDados';
import useCsrfInit from './componentes/useCsrfInit';

import { useEffect, useState} from 'react';

import useRequestDjango from './componentes/useRequestDjango';

function App() {
  {/**- Tudo fora do return (dentro da função do componente) 
    é onde você coloca lógica, hooks, variáveis, chamadas de API, etc.
 */}

  /** Recebe um GET do django com o cookies */
  useCsrfInit();
  {/** - Tudo dentro do return é JSX, ou seja, a 
    estrutura visual que será renderizada na tela.*/}

  const [dadosRequestLinks, setDadosRequestLinks] = useState(null);
  const linksBaseDados = "http://localhost:8000/requestBaseDados/";
  
  const dados = useRequestDjango(linksBaseDados, {dados: 'Listar links'})
  setDadosRequestLinks(dados)
  return (
    <div className="App">
        <FormularioLinkYoutube />      
        <LinkBancoDados dados={dadosRequestLinks}/>
    </div>
  );
}

export default App;


/** RAFCE Para criar uma estrutura no componentes */