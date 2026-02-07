import { useState, useEffect } from 'react';
import { verificarUsuarioLogado } from './Componentes/statusLoginDjango';

import getCookies from './Componentes/getCookies';
import useCsrfInit from './Componentes/useCsrfInit';
import sendRequestDjango from './Componentes/sendRequestDjango';

import './App.css'

import LinkBancoDados from './Componentes/LinkBancoDados';
import PlayerMidiasMp3 from './Componentes/PlayerMidiasMp3';
import PlayerMidiasMp4 from './Componentes/PlayerMidiasMp4';
import PlayerMidias from './Componentes/PlayerMidias';
import LoginUsuario from './Componentes/LoginUsuario';

const urlDefaultDjango = `http://localhost:8080`

function App() {

  const [statusLogin, setStatusLogin] = useState(false);
  
  /** Recebe um GET do django com o cookies */
  useCsrfInit()

  useEffect(() => {

    const valorUserLodago = sessionStorage.getItem('usuarioLogado')
    setStatusLogin(valorUserLodago)
    console.log('Valor usuário Logado: ', valorUserLodago)

  }, []);


  {/**- Tudo fora do return (dentro da função do componente) é onde você coloca lógica, hooks, variáveis, chamadas de API, etc. */} 
  {/** - Tudo dentro do return é JSX, ou seja, a estrutura visual que será renderizada na tela.*/}
  
  const [atualizarBanco, setAtualizarBanco] = useState(0);
  const [linkMidia, setLinkMidia] = useState([null, null]);
  const [ativarPlayer, setAtivarPlayer] = useState(false);

  const [elementoLinks, setElementoLinks] = useState(false);
  const [elementoMp3, setElementoMp3] = useState(false);
  const [elementoMp4, setElementoMp4] = useState(false);
  const [spinnerPlayer, setSpinnerPlayer] = useState(false);
  
  /** Para ativar o player de midias 
   * Se o link tiver algum valor o player é ativado */
  useEffect(() => {
    if (linkMidia[0] !== null) {

      setSpinnerPlayer(true);

      if (ativarPlayer) {
        setAtivarPlayer(false);
        setTimeout(() => {
          setSpinnerPlayer(false);
          setAtivarPlayer(true);
          setElementoLinks(false)
        }, 1000);
      } else if (!ativarPlayer){
        setTimeout(() => {
          setAtivarPlayer(true);
          setSpinnerPlayer(false);
          setElementoLinks(false)
        }, 1000);
        
      }
    }
  }, [linkMidia]);  

  // VERIFICAR SE O USUÁRIO ESTA ONLINE. 
  useEffect(()=> {
    const toUserLogado = () => {

      if (statusLogin) {
        setElementoLinks(true)
      } else {
        setElementoMp3(false)
        setElementoMp4(false)
        setSpinnerPlayer(false)
      }
    }

    toUserLogado()

  }, [statusLogin])

  // Verificar se o usuário esta logado, envia um sinal para o django para saber se continuar
  // logado pelo sistema back, caso o usuário fique deslogado o sistema volta para o elemento de logar. 
  useEffect(() => {

    const verificaStatusUser = async () => {
      const linkSendRequest = `${urlDefaultDjango}/credenciais_login/`;
      const PAYLOAD = {
        'tipoRequest': 'verificarUsuarioLogado',
      }
      const responseStatus = await verificarUsuarioLogadolinkSendRequest(linkSendRequest, PAYLOAD)
      sessionStorage.setItem('usuarioLogado', false)
    }

    // Verificar a cada 5 minutos se o usuário esta logado. 
    if (statusLogin) {
      setInterval(()=> {
          verificaStatusUser()
      }, 10000)
    }
  }, [])

  /** Recebe o sinal de fechando do elementro de produzir player*/
  const fecharPlayerMidia = () => {
    setAtivarPlayer(false);
    setLinkMidia([null, null]);
  }

  /** Abre o elemento onde estão os link que estão salvos. */
  const linksSalvos = () => {

    if (!elementoLinks) {
      setElementoLinks(true);
      setElementoMp3(false);
      setElementoMp4(false);
      setSpinnerPlayer(false);
      setAtivarPlayer(false);
    } else if (elementoLinks) {
      setElementoLinks(false);
      setElementoMp3(false);
      setAtivarPlayer(false);      
    }
  }

  /** Abre o elemento onde estão as mídias MP3 salvas. */
  const midiasMp3 = () => {

    console.log(statusLogin)

    if (!elementoMp3) {
      setElementoMp3(true);
      setElementoMp4(false);
      setElementoLinks(false);
      setAtivarPlayer(false);
    } else if (elementoMp3) {
      setElementoMp3(false);
      setElementoLinks(false);
      setAtivarPlayer(false);
    }
  }

   /** Abre o elemento onde estão as mídias MP4 salvas. */
  const midiasMp4 = () => {

    console.log(statusLogin)

    if (!elementoMp4) {
      setElementoMp4(true);
      setElementoMp3(false);
      setElementoLinks(false);
      setAtivarPlayer(false);
    } else if (elementoMp4) {
      setElementoMp4(false);
      setElementoMp3(false);
      setElementoLinks(false);
      setAtivarPlayer(false);
    }
  }

  const deslogar = async () => {

    console.log('USUÁRIO LOGADO:', statusLogin)

    if (statusLogin) {
          const PAYLOAD = {
            'tipoRequest': 'deslogarUsuario',
        }
        const urlDjangoLogin = `${urlDefaultDjango}/credenciais_login/`;
        const responseDjango = await sendRequestDjango(urlDjangoLogin, PAYLOAD);
        console.log(responseDjango);
        setStatusLogin(false);
      }
  }

  return (
    
      <div className="App">

        {/** Se o usuário estiver deslogado */}
        {!statusLogin && <LoginUsuario infoStatusLogin={(statusLogado) => setStatusLogin(statusLogado)}/>}

        {statusLogin && (
          <>
            <div className='app-divBtnImg'>

              <img src="/img/imgBtns/pasta_links.png" alt="player" className="app-imgBtn" title='Links Salvos' onClick={linksSalvos} />
              <img src="/img/imgBtns/mp3.png"         alt="player" className="app-imgBtn" title='Player MP3'   onClick={midiasMp3}   />
              <img src="/img/imgBtns/mp4.png"         alt="player" className="app-imgBtn" title='Player MP4'   onClick={midiasMp4} />

            </div>

            {spinnerPlayer && 
              <div className="app-divImgLoading">

                  <p>Carregando mídia...</p>
                  <img  className="linkBancoDados-imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/>

              </div>
            }

            {ativarPlayer   && <PlayerMidias executandoMidia={linkMidia} fecharPlayer={() => fecharPlayerMidia()} />}

            {elementoLinks  && <LinkBancoDados propsStatusProcesso={atualizarBanco} />}

            {elementoMp3    && <PlayerMidiasMp3 executaMidia={(link, tipoMidia) => setLinkMidia([link, tipoMidia])} />}
            {elementoMp4    && <PlayerMidiasMp4 executaMidia={(link, tipoMidia) => setLinkMidia([link, tipoMidia])} />}
          </>)}
      </div>
  )
}

export default App
