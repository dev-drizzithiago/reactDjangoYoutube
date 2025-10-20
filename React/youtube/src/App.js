import './App.css';

import LogoYoutube from './componentes/LogoYoutube'
import FormularioLinkYoutube from './componentes/FormularioLinkYoutube';
import LinkBancoDados from './componentes/LinkBancoDados';
import useCsrfInit from './componentes/useCsrfInit';

function App() {
  return (
    <div className="App">
      useCsrfInit()



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