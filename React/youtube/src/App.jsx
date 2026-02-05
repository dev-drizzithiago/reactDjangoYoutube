import { useState, useEffect } from 'react'
import './App.css'

import useCsrfInit from './Componentes/useCsrfInit';

import sendRequestDjango from './Componentes/sendRequestDjango';

import LinkBancoDados from './Componentes/LinkBancoDados';
import PlayerMidiasMp3 from './Componentes/PlayerMidiasMp3';
import PlayerMidiasMp4 from './Componentes/PlayerMidiasMp4';
import PlayerMidias from './Componentes/PlayerMidias';
import LoginUsuario from './Componentes/LoginUsuario';

const urlDefaultDjango = `http://localhost:8080`

function App() {

  {/**- Tudo fora do return (dentro da função do componente) é onde você coloca lógica, hooks, variáveis, chamadas de API, etc. */}

  /** Recebe um GET do django com o cookies */
  useCsrfInit();

  {/** - Tudo dentro do return é JSX, ou seja, a estrutura visual que será renderizada na tela.*/}
  const [statusLogin, setStatusLogin] = useState(false);
  
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

  /** Avalia se o usuário esta logado, caso não esteja o 
   * elemento do login é chamado e todos os elementos são fechados 
   * */ 

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
    console.log('Status de login do usuário: ', statusLogin)

    const verificaUserLogado = async () => {      
        const urlDjango = `${urlDefaultDjango}/credenciais_login/`
        const payload = {
          tipoRequest: "verificarUsuarioLogado"
        }
        const resquestDjango = await sendRequestDjango(urlDjango, payload)
       
        if (!resquestDjango.usuario_logado) {
          setStatusLogin(resquestDjango.usuario_logado)
        } 
      }

    if (statusLogin) {
      setInterval(()=> {
        verificaUserLogado()
      }, 300000)
    } 
    }, [])      

  /** Recebe o sinal de fechando do elementro de produzir player*/
  const fecharPlayerMidia = () => {
    setAtivarPlayer(false);
    setLinkMidia([null, null]);
  }

  /** Abre o elemento onde estão os link que estão salvos. */
  const linksSalvos = () => {

    console.log(statusLogin)

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
