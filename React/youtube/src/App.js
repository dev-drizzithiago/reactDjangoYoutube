import './App.css';

import LogoYoutube from './componentes/LogoYoutube'
import FormularioLinkYoutube from './componentes/FormularioLinkYoutube';
import LinkBancoDados from './componentes/LinkBancoDados';
import useCsrfInit from './componentes/useCsrfInit';

function App() {
  {/**- Tudo fora do return (dentro da função do componente) 
    é onde você coloca lógica, hooks, variáveis, chamadas de API, etc.
 */}

  useCsrfInit();
  {/** - Tudo dentro do return é JSX, ou seja, a estrutura visual que será renderizada na tela.*/}
  
  return (
    <div className="App">
      <div className='logoPrincipal'>
        <LogoYoutube />        
      </div>

      <div className='divPgPrincipal formsInputLink'>
        <FormularioLinkYoutube />
      </div>

      <div className='containePrincipal'>
        <div className='divPgPrincipal viewLinksyoutube'>
          <LinkBancoDados />
        </div>
      </div>
    </div>
  );
}

export default App;


/** RAFCE Para criar uma estrutura no componentes */