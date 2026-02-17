import './App.css'

// - Usa useEffect para rodar lógica ao montar o componente.
import { useState, useEffect } from 'react';

import { IoMdLogOut } from "react-icons/io";
import { BsFiletypeMp3 } from "react-icons/bs";
import { BsFiletypeMp4 } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";

//- useSelector → acessa o estado global do Redux.
//- useDispatch → dispara actions para alterar o estado.
import { useDispatch, useSelector } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';

// - Importa as actions criadas no slice.
import { loginSuccess, logout } from './Componentes/sessionSlice';

import { verificarUsuarioLogado } from './Componentes/statusLoginDjango';

import useCsrfInit from './Componentes/useCsrfInit';
import sendRequestDjango from './Componentes/sendRequestDjango';

import FormularioLinkYoutube from './Componentes/FormularioLinkYoutube';
import LinkBancoDados from './Componentes/LinkBancoDados';
import PlayerMidiasMp3 from './Componentes/PlayerMidiasMp3';
import PlayerMidiasMp4 from './Componentes/PlayerMidiasMp4';
import PlayerMidias from './Componentes/PlayerMidias';
import LoginUsuario from './Componentes/LoginUsuario';
import { preconnect } from 'react-dom';

const urlDefaultDjango = `http://localhost:8080`


function App() {

  /** Recebe um GET do django com o cookies - Verifica se o usuário esta logado pelo backend*/
  useCsrfInit()

  const [statusLogin, setStatusLogin] = useState(false);
  const [atualizarBanco, setAtualizarBanco] = useState(0);
  const [linkMidia, setLinkMidia] = useState([null, null]);
  const [ativarPlayer, setAtivarPlayer] = useState(false);

  const [elementoLinks, setElementoLinks] = useState(false);
  const [elementoMp3, setElementoMp3] = useState(false);
  const [elementoMp4, setElementoMp4] = useState(false);
  const [spinnerPlayer, setSpinnerPlayer] = useState(false);
  
  // - Cria dispatch para enviar ações.
  const dispatch = useDispatch()
  
  // - Pega logado e usuario do estado global (state.session).
  const { logado, usuario } = useSelector((state) => state.session)

  // VERIFICA SE O USUÁRIO ESTA LOGADO NO PRIMEIRO ACESSO AO SITE, GERALMENTE VERIFICA COM O DJANGO, MAS 
  // PODE CONTER O STATUS PELA SESSION É MELHOR SEMPRE VERIFICAR. 
  useEffect(() => {
    const testeStatusoLogin = () => {      
      setStatusLogin(true)
    }
    if (logado) {
      setTimeout(()=> {
        testeStatusoLogin()
      }, 2000)
    }    
  }, [logado]);

  {/**- Tudo fora do return (dentro da função do componente) é onde você coloca lógica, hooks, variáveis, chamadas de API, etc. */} 
  {/** - Tudo dentro do return é JSX, ou seja, a estrutura visual que será renderizada na tela.*/}  
  
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

  // VERIFICAR SE O USUÁRIO ESTA ONLINE. CASO ESTEJA, VAI DIRECIONAR PARA OS LINKS
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
      const PAYLOAD = { 'tipoRequest': 'verificarUsuarioLogado' }

      // - verificaLogin → chama o backend Django para saber se o usuário ainda está logado.
      const responseStatusLogindjango = await verificarUsuarioLogado(linkSendRequest, PAYLOAD)
      console.log(responseStatusLogindjango)

      if (responseStatusLogindjango) {

        // - Se sim → dispara loginSuccess e atualiza Redux.
        dispatch(loginSuccess(responseStatusLogindjango.usuario_logado))

      } else {

        // - Se não → dispara logout.
        setStatusLogin(responseStatusLogindjango)
        dispatch(logout())
      }
    }

    // Verificar a cada 5 minutos se o usuário esta logado.     
    setInterval(()=> {
        verificaStatusUser()
    }, 600000)
  }, [statusLogin])

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
    if (statusLogin) {
      const PAYLOAD = {
        'tipoRequest': 'deslogarUsuario',
      }
      const urlDjangoLogin = `${urlDefaultDjango}/credenciais_login/`;
      const responseDjango = await sendRequestDjango(urlDjangoLogin, PAYLOAD);
      setStatusLogin(false)
      toast.success(responseDjango.mensagem_erro)
      }
  }

  return (
    
      <div className="App">
        <ToastContainer />

        {/** Se o usuário estiver deslogado */}
        {!statusLogin && <LoginUsuario infoStatusLogin={(statusLogado) => setStatusLogin(statusLogado)}/>}        
        
        {statusLogin && (          
          <>
            <div className='app-divBtnImg'>
                  
                <div>
                  <FaHome className='app-imgBtn'  onClick={linksSalvos} title='AbrirLinks Salvos'/>
                </div>

                <div>
                  <BsFiletypeMp3 className='app-imgBtn' onClick={midiasMp3} title='Abrir Player MP3' />
                </div>

                <div>
                  <BsFiletypeMp4 className='app-imgBtn' onClick={midiasMp4} title='Abrir Player MP4'/>
                </div>

                <div className='app-divBtnConfConta'>
                  <IoMdLogOut className='app-imgBtn app-btnDeslogar' onClick={deslogar} title='Logout'/>
                </div>

                <div >
                  <IoSettings className='app-imgBtn app-btnConfigurarConta' title='Configurar'/>
                </div>
            </div>

            {spinnerPlayer && 
              <div className="app-divImgLoading">

                  <p>Carregando mídia...</p>
                  <img  className="linkBancoDados-imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/>

              </div>
            }
            <FormularioLinkYoutube onLinkAdicionado={(linkAdicionado) => setAtualizarBanco(linkAdicionado)}/>

            {ativarPlayer   && <PlayerMidias executandoMidia={linkMidia} fecharPlayer={() => fecharPlayerMidia()} />}
            {elementoLinks  && <LinkBancoDados propsStatusProcesso={atualizarBanco} />}
            {elementoMp3    && <PlayerMidiasMp3 executaMidia={(link, tipoMidia) => setLinkMidia([link, tipoMidia])} />}
            {elementoMp4    && <PlayerMidiasMp4 executaMidia={(link, tipoMidia) => setLinkMidia([link, tipoMidia])} />}
          </>)}
      </div>
  )
}

export default App
