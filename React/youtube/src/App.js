import './App.css';
import useCsrfInit from './componentes/useCsrfInit';
import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Link, NavLink } from 'react-router-dom';

import sendRequestDjango from './componentes/sendRequestDjango';

import VerificarUsuarioLogado from './componentes/VerificarUsuarioLogado'
import FormularioLinkYoutube from './componentes/FormularioLinkYoutube';
import LinkBancoDados from './componentes/LinkBancoDados';
import PlayerMidiasMp3 from './componentes/PlayerMidiasMp3';
import PlayerMidias from "./componentes/PlayerMidias"
import LoginUsuario from './componentes/LoginUsuario';

function App() {
  {/**- Tudo fora do return (dentro da função do componente) é onde você coloca lógica, hooks, variáveis, chamadas de API, etc. */}

  /** Recebe um GET do django com o cookies */
  useCsrfInit();

  {/** - Tudo dentro do return é JSX, ou seja, a estrutura visual que será renderizada na tela.*/}
  
  const [atualizarBanco, setAtualizarBanco] = useState(0);
  const [elementoSelecionado, setElementoSelecionado] = useState(0)
  const [linkMidia, setLinkMidia] = useState([null, null])
  const [ativarPlayer, setAtivarPlayer] = useState(false)
  const [statusLogin, setStatusLogin] = useState(false)
   

  /** Para ativar o player de midias */
  useEffect(() => {
    if (linkMidia[0] !== null) {
      setAtivarPlayer(true)
    }
  }, [linkMidia])
  
  const fecharPlayerMidia = () => {
    setAtivarPlayer(false)
    setLinkMidia([null, null])
  }

  const linksSalvos = () => {
    console.log('Links')
    setElementoSelecionado(1)
  }

  const midiasMp3 = () => {
    console.log('MP3')
    setElementoSelecionado(1)
  }

  const midiasMp4 = () => {
    console.log('MP4')
    setElementoSelecionado(1)
  }

  const deslogar = async () => {
    if (statusLogin) {
          const PAYLOAD = {
            'tipoRequest': 'deslogarUsuario',
        }
        const urlDjangoLogin = `http://localhost:8000/credenciais_login/`;
        const responseDjango = await sendRequestDjango(urlDjangoLogin, PAYLOAD)
        console.log(responseDjango)
        setStatusLogin(false)
      }
  }

  return (
    <div className="App">
      <VerificarUsuarioLogado responseUserLogado={
        (StatusLoginUsuario) => setStatusLogin(StatusLoginUsuario)
      } />
      
        <BrowserRouter>
        {statusLogin && <FormularioLinkYoutube onLinkAdicionado={() => setAtualizarBanco(prev => prev + 1)} />}
          <div className='app-divBtnImg'>
            <NavLink to="/linksSalvos"><img src="/img/imgBtns/pasta_links.png" alt="player" className="app-imgBtn" onClick={linksSalvos}  /></NavLink>
            <NavLink to="/midiasMp3"  ><img src="/img/imgBtns/mp3.png"         alt="player" className="app-imgBtn" onClick={midiasMp3}    /></NavLink>
            <NavLink to="/midiasMp4"  ><img src="/img/imgBtns/mp4.png"         alt="player" className="app-imgBtn" onClick={midiasMp4}    /></NavLink>
            
            <NavLink to="/deslogar">            
            {!statusLogin ? 
            <img src="/img/imgBtns/desligar.png" alt="player" className="app-imgBtn" onClick={deslogar} title='Desconectado'/> :
            <img src="/img/imgBtns/ligar.png"    alt="player" className="app-imgBtn" title='Conectado'/>
            }
            </NavLink>

          </div>           

          {ativarPlayer && <PlayerMidias executandoMidia={linkMidia} fecharPlayer={() => fecharPlayerMidia()} />}

          {!statusLogin ? <LoginUsuario infoStatusLogin={(returnStatusLogin) => setStatusLogin(returnStatusLogin)}/> : 

          <Routes>
            {statusLogin && <Route path='linksSalvos' element={<LinkBancoDados triggerAtualizacao={atualizarBanco} />}/>}
            
            {statusLogin && <Route path='midiasMp3'   element={<PlayerMidiasMp3 executaMidia={(link, tipoMidia) => setLinkMidia([link, tipoMidia])} />} />}
          </Routes>}

        </BrowserRouter>
    </div>
  );
}

export default App;


/** RAFCE Para criar uma estrutura no componentes */