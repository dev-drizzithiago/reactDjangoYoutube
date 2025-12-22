import './App.css';
import useCsrfInit from './componentes/useCsrfInit';
import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Link, NavLink } from 'react-router-dom';

import sendRequestDjango from './componentes/sendRequestDjango';

import VerificarUsuarioLogado from './componentes/VerificarUsuarioLogado';
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
  const [linkMidia, setLinkMidia] = useState([null, null])
  const [ativarPlayer, setAtivarPlayer] = useState(false)
  const [statusLogin, setStatusLogin] = useState(false)

  const [elementoLinks, setElementoLinks] = useState(false)
  const [elementoMp3, setElementoMp3] = useState(false)

  // console.log('Elemento link: ',elementoLinks)
  // console.log('Elemento mp3: ',elementoMp3)

  /** Para ativar o player de midias */
  useEffect(() => {
    if (linkMidia[0] !== null) {
      setAtivarPlayer(true)
    }
  }, [linkMidia])


  useEffect(() => {
    if (statusLogin) {
      setElementoLinks(false)
      setElementoMp3(false)
    }
  }, [])

  const fecharPlayerMidia = () => {
    setAtivarPlayer(false)
    setLinkMidia([null, null])
  }

  const linksSalvos = () => {
    console.log('Links')

    if (!elementoLinks) {
      setElementoLinks(true)
      setElementoMp3(false)
    } else if (elementoLinks) {
      setElementoLinks(false)
      setElementoMp3(false)
    }
  }

  const midiasMp3 = () => {

    console.log('MP3')
    if (!elementoMp3) {
      setElementoMp3(true)
      setElementoLinks(false)
    } else if (elementoMp3) {
      setElementoMp3(false)
      setElementoLinks(false)
    }
  }

  const midiasMp4 = () => {
    console.log('MP4')
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

      {/** Se o usuário estiver deslogado */}
      {!statusLogin && <LoginUsuario infoStatusLogin={(statusLogado => setStatusLogin(statusLogado))}/>}

      {statusLogin &&
        <div className='app-divBtnImg'>
          <img src="/img/imgBtns/pasta_links.png" alt="player" className="app-imgBtn" title='Links Salvos' onClick={linksSalvos} />
          <img src="/img/imgBtns/mp3.png"         alt="player" className="app-imgBtn" title='Player MP3'   onClick={midiasMp3}   />
          <img src="/img/imgBtns/mp4.png"         alt="player" className="app-imgBtn" title='Player MP4'   onClick={midiasMp4} />
        </div>
      }

      {ativarPlayer   && <PlayerMidias executandoMidia={linkMidia} fecharPlayer={() => fecharPlayerMidia()} />}
      {elementoLinks  && <LinkBancoDados propsStatusProcesso={atualizarBanco} />}
      {elementoMp3    && <PlayerMidiasMp3 executaMidia={(link, tipoMidia) => setLinkMidia([link, tipoMidia])} />}
      

    </div>
  );
}

export default App;


/** RAFCE Para criar uma estrutura no componentes */