import './App.css';

import FormularioLinkYoutube from './componentes/FormularioLinkYoutube';
import LinkBancoDados from './componentes/LinkBancoDados';
import EventsBtns from './componentes/EventsBtns'

function App() {
  return (
    <div className="App">
      <h1> Ola, mundo!</h1>
      <FormularioLinkYoutube />
      <LinkBancoDados />
      <EventsBtns />
    </div>
  );
}

export default App;
