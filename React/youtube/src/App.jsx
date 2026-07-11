import './App.css'

// - Usa useEffect para rodar lógica ao montar o componente.
import { useState, useEffect } from 'react';

import { IoMdLogOut } from "react-icons/io";
import { BsFiletypeMp3 } from "react-icons/bs";
import { BsFiletypeMp4 } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";

import { MdOutlineOpenInFull } from "react-icons/md";
import { MdOutlineCloseFullscreen } from "react-icons/md";

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

import { urlDefaultDjango } from './urls';

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
  const [ tipoMidia, setTipoMidia ] = useState(null)

  const [abrirFormsAddLink, setAbrirFormsAddLink] = useState(false);
  const [configurarContaAtivo, setConfigurarContaAtivo] = useState(false);
  
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
      setTipoMidia(linkMidia[1])
      setSpinnerPlayer(true);

      if (ativarPlayer) {
        setAtivarPlayer(false);
        setTimeout(() => {
          setSpinnerPlayer(false);
          setAtivarPlayer(true);
          setElementoLinks(false);
          
        }, 1000);
      } else if (!ativarPlayer){
        setTimeout(() => {
          setAtivarPlayer(true);
          setSpinnerPlayer(false);
          setElementoLinks(false);
          setElementoMp3(false);
          setElementoMp4(false);
        }, 1000);
      }
    } else {
      if (tipoMidia === 'audio/mp3') {
        setElementoMp3(true);
      } else {
        setElementoMp4(true);        
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

      if (responseStatusLogindjango) {

        // - Se sim → dispara loginSuccess e atualiza Redux.
        dispatch(
          loginSuccess({
            logado: responseStatusLogindjango.usuario_logado,
            nomeUsuario: responseStatusLogindjango.nome_usuario,
            usuario: responseStatusLogindjango.usuario_login,
          }));

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

  /**
   * Fecha o player de mídia e limpa o link em execução.
   * @returns {void}
   */
  const fecharPlayerMidia = () => {
    setAtivarPlayer(false);
    setLinkMidia([null, null]);
  }

  /**
   * Alterna a exibição do elemento com os links salvos, fechando os demais painéis.
   * @returns {void}
   */
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

  /**
   * Alterna a exibição do player de mídias MP3, fechando os demais painéis.
   * @returns {void}
   */
  const midiasMp3 = () => {

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

  /**
   * Alterna a exibição do player de mídias MP4, fechando os demais painéis.
   * @returns {void}
   */
  const midiasMp4 = () => {

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

  /**
   * Alterna a exibição do formulário para adicionar um novo link.
   * @returns {void}
   */
  const defStatusFormsAddLinks = () => {

    if (abrirFormsAddLink) {
      setAbrirFormsAddLink(false)
    } else if (!abrirFormsAddLink) {
      setAbrirFormsAddLink(true)
    }

  }

  /**
   * Alterna a exibição do formulário de configuração da conta do usuário.
   * @returns {void}
   */
  const abrirFormsUsuario = () => {

    if (!configurarContaAtivo) {
      setConfigurarContaAtivo(true)
      setElementoMp3(false);
      setElementoMp4(false);
      setElementoLinks(false);
      setAtivarPlayer(false);
    } else if (configurarContaAtivo) {
      setElementoMp3(false);
      setElementoLinks(false);
      setAtivarPlayer(false);
    }

  }

  /**
   * Solicita ao Django o logout do usuário e limpa o estado local/global da sessão.
   * @returns {Promise<void>}
   */
  const deslogar = async () => {

    if (statusLogin) {
      const PAYLOAD = {
        'tipoRequest': 'deslogarUsuario',
      }
      const urlDjangoLogin = `${urlDefaultDjango}/credenciais_login/`;
      const responseDjango = await sendRequestDjango(urlDjangoLogin, PAYLOAD);

      dispatch(logout())
      setStatusLogin(false)
      toast.success(responseDjango.mensagem_erro)

      setConfigurarContaAtivo(false)
      setElementoMp3(false);
      setElementoMp4(false);
      setElementoLinks(false);
      setAtivarPlayer(false);
    }

  }

  return (
      <div className="App">
        <ToastContainer />

        {/** Se o usuário estiver deslogado */}
        {!statusLogin && <LoginUsuario infoStatusLogin={(statusLogado) => setStatusLogin(statusLogado)}/>}        
        
        {statusLogin && (
          <div className='app-mainLayout'>
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

                {abrirFormsAddLink ?
                <MdOutlineCloseFullscreen className='app-imgBtn' onClick={defStatusFormsAddLinks} title='Abrir Forms' /> :
                <MdOutlineOpenInFull className='app-imgBtn'  onClick={defStatusFormsAddLinks} title='Fechar Forms' />}

                {/* Abre o formulário para configurar conta. */}
                <div >
                  <IoSettings className='app-imgBtn app-btnConfigurarConta' title='Configurar' onClick={abrirFormsUsuario}/>
                </div>

                <div className='app-divBtnDeslogar'>
                  <p className='app-userLogado'>Ola, {usuario} <FaRegUser /></p>
                  <IoMdLogOut className='app-imgBtn app-btnDeslogar' onClick={deslogar} title='Logout'/>
                </div>
            </div>

            <div className='app-content'>
              {/* CONFIGURAR CONTA */}
              {configurarContaAtivo &&
              <LoginUsuario
                boolUserLogado={logado}
                infoDadosAtualizado={(dadosAtualizados) => setConfigurarContaAtivo(dadosAtualizados)}
                AtivarLinksPosAtualizarDadosUser={(statusAtivarLinks) => setElementoLinks(statusAtivarLinks)}
              />}

              {spinnerPlayer &&
                <div className="app-divImgLoading">
                    <p>Carregando mídia... </p>
                    <img
                      className="linkBancoDados-imgLoading"
                      src="/img/imgBtns/spinner.gif"
                      alt="Carregando..."
                    />
                </div>
              }
              {abrirFormsAddLink && <FormularioLinkYoutube
                onLinkAdicionado={(linkAdicionado) => setAtualizarBanco(linkAdicionado)}
                fecharFormularioAdicionarLonk={(fecharJanela) => setAbrirFormsAddLink(fecharJanela)}
              />}

              {ativarPlayer && <PlayerMidias executandoMidia={linkMidia} fecharPlayer={() => fecharPlayerMidia()}/>}
              {elementoLinks && <LinkBancoDados propsStatusProcesso={atualizarBanco} />}

              {elementoMp3 && <PlayerMidiasMp3
                executaMidia={(link, tipoMidia) => setLinkMidia([link, tipoMidia])}               
              />}

              {elementoMp4 && <PlayerMidiasMp4
                executaMidia={(link, tipoMidia) => setLinkMidia([link, tipoMidia])}                
              />}
            </div>
          </div>)}
      </div>
  )
}

export default App
