import './LoginUsuario.css';

import sendRequestDjango from './sendRequestDjango';

// Imports hooks personalizados
import useRequestDjango from './useRequestDjango';

// Import hooks do React
import { useEffect, useState } from 'react';
import {  logarUsuario } from './statusLoginDjango';

// - Importa as actions criadas no slice.
import { loginSuccess } from './sessionSlice';

//- useSelector → acessa o estado global do Redux.
//- useDispatch → dispara actions para alterar o estado.
import { useDispatch, useSelector } from 'react-redux';

// Icones para os botões
import { FaSave } from "react-icons/fa";
import { FaBackspace } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { GrUserNew } from "react-icons/gr";
import { GiConfirmed } from "react-icons/gi";
import { AiOutlineClear } from "react-icons/ai";

import { toast } from 'react-toastify';

const urlDefaultDjango = `http://192.168.15.250:8080`

const LoginUsuario = ({ infoStatusLogin, boolUserLogado, infoDadosAtualizado, AtivarLinksPosAtualizarDadosUser }) => {

  const [criarUser, setCriarUser] = useState(false)
  const [ativaFormsLogin, setAtivaFormsLogin] = useState(false);  

  const [configurarConta, setConfigurarConta] = useState(false)

  const [dadosUsuario, setDadosUsuario] = useState({})

  const [btnCriarNovoUserAtivo, setBtnCriarNovoUserAtivo] = useState(true)

  const [ncNomeCompleto, setNcNomeCompleto] = useState('')
  const [ncUsuario, setNcUsuario] = useState('')
  const [ncEmail, setNcEmail] = useState('')
  const [ncPrimeiraSenha, setNcPrimeiraSenha] = useState('')
  const [ncConfirSenha, setNcconfirSenha] = useState('')

  const [dadosParaLogin, setDadosParaLogin] = useState([])
  const [msnAlerta, setMsgAlerta] = useState('Entre com suas credenciais')

  const dispatch = useDispatch()
  const { logado, usuario, nomeUsuario } = useSelector((state) => state.session)

  // Indentifica se o usuário está logado, se sim, encaminha para página principal do sistema. 
  // Se não, permanece na página de login.
  useEffect(() => {
    if (usuario) {      
      setAtivaFormsLogin(true)
    } else {
      setAtivaFormsLogin(false)
    }
  }, [logado])

  // Verifica se o usuário já está logado. Se sim, ativa o formulário para configurar os dados.
  useEffect(() => {

    if (boolUserLogado) {
      setCriarUser(true)
      setConfigurarConta(true)
      setAtivaFormsLogin(false)

        const definirConfigurarConta = async () => {

          const urlDjango = `${urlDefaultDjango}/credenciais_login/`

          const PLAYLOAD = {
            'tipoRequest': 'informacaoUsuario',
          }

          const responseDjangoInfoCredencialUsuario = await sendRequestDjango(urlDjango, PLAYLOAD)

          if (responseDjangoInfoCredencialUsuario.erro_processo === 0) {
            setNcNomeCompleto(responseDjangoInfoCredencialUsuario.nome_usuario)
            setNcUsuario(responseDjangoInfoCredencialUsuario.usuario_login)
            setNcEmail(responseDjangoInfoCredencialUsuario.email_usuario)
            setNcPrimeiraSenha(responseDjangoInfoCredencialUsuario.password_usuario)
            setNcconfirSenha(responseDjangoInfoCredencialUsuario.password_usuario)
          }
          console.log('Informações do usuário logado: ', responseDjangoInfoCredencialUsuario)
          
      }

      definirConfigurarConta()
    }
  }, [])


  // Quanto ativa o botão para criar novo usuário. Abre o bloco de formulário
  const criarNovoUsuario = () => {
    setBtnCriarNovoUserAtivo(false)
    setCriarUser(true)
  }

  /** FUNÇÃO PARA SALVAR CREDENCIAIS. */
  const salvarNovoUser = async () => {

    if (ncNomeCompleto === '' &&
      ncUsuario === '' &&
      ncEmail === '' &&
      ncPrimeiraSenha === '' &&
      ncConfirSenha === ''
    ) {
      toast.warning("Preencha todo o formulário...")
      return
    }

    if (ncPrimeiraSenha === ncConfirSenha) {
      const linkSendRequest = `${urlDefaultDjango}/credenciais_login/`;

      const PAYLOAD = {
        'tipoRequest': 'salvarCadastro',
        'dadosCredencial': {
          'nomeUsuario': ncNomeCompleto,
          'userLogin': ncUsuario,
          'emailUsuario': ncEmail,
          'passUsuario': ncConfirSenha,
        },

      }
      const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)      

      if (responseDjango.erro_processo === 0) {
        // Geralmente o erro 0 é considerado normal.
        toast.success('Conta criado com sucesso.')

        limparFormulario()

        setTimeout(() => {
          if (criarUser) {
            setCriarUser(false)
          }
        }, 5000)

      } else if (responseDjango.erro_processo === 1) {

        // Geralmente o erro 1 é considerado critico.
        console.log(responseDjango.mensagem_processo)
        toast.warning('Erro no processo para criar novo usuário')

      } else if ( responseDjango.erro_processo === 5 ) {
        
        toast.warning(responseDjango.mensagem_processo)

        setTimeout(() => {
          if (criarUser) {
            setCriarUser(false)
          }
        }, 5000)
      } 
      
      // O elemento fecha e o botão para criar novo usuário é aberto;
      setBtnCriarNovoUserAtivo(true)  
      
    } else {
      toast.error('As senhas não confere!')
    }
    
  }

  const limparFormulario = () => {
    setNcNomeCompleto('')
    setNcUsuario('')
    setNcEmail('')
    setNcPrimeiraSenha('')
    setNcconfirSenha('')
  }
  
  /** Função para o usuário se logar  */
  const eventoLogin = async (event) => {

    const linkSendRequest = `${urlDefaultDjango}/credenciais_login/`;
    
      if (dadosParaLogin.length === 0) {
        toast.warning('Entre com Login e Senha')
      }
      else if (dadosParaLogin.userLogin === undefined) {
        toast.warning('Entre com Login')
      }
      else if (dadosParaLogin.passLogin === undefined) {
        toast.warning('Entre com sua Senha')
      }
      else {

        const PAYLOAD = {
          'tipoRequest': 'realizarLogin',
          'dadosCredencial': {
            'userLogin': dadosParaLogin.userLogin,
            'passUsuario': dadosParaLogin.passLogin, 
          },
        }

        const responseDjango = await logarUsuario(linkSendRequest, PAYLOAD)
        
        console.log(responseDjango)

        if (responseDjango !== undefined) {

          if (responseDjango.erro_processo === 1 ) {
            // Erro critico

            toast.error(responseDjango.mensagem_processo)

          } else if (Number(responseDjango.erro_processo) === 2) {            
            // Credenciais incorretas

            toast.error(responseDjango.mensagem_processo)

          } else if (Number(responseDjango.erro_processo) === 0) {
            // Não ocorreu nenhum erro no processo 

            if (responseDjango.nome_usuario === 'AnonymousUser'){
              // Valida se o usuário é desconhecido.               
              // Retorna o valor para o app
              infoStatusLogin(false)

            } else if (responseDjango.usuario_logado) {
              toast.success('Login realizado com sucesso...')

              infoStatusLogin(responseDjango.usuario_logado)

              // Coloca na session o estado do login. 
              dispatch(loginSuccess({
                usuario: responseDjango.usuario_login,
                nomeUsuario: responseDjango.nome_usuario,
                logado: responseDjango.usuario_logado,
              }));
            }
          } else {
              toast.error(responseDjango.mensagem_erro)
          }
        } else {
          toast.error('Erro no login!')
        }
      }
      setTimeout(() => {
        setMsgAlerta('Entre com suas credenciais')
      }, 30000);    
  }

  const atualizarCadastros = () => {
    console.log('Btn Atualizar cadastro...')

    setAtivaFormsLogin(false)
    setCriarUser(false)
    infoDadosAtualizado(false)
    AtivarLinksPosAtualizarDadosUser(true)  // Envia para o app

  }

  const cancelar = () => {

    console.log('Cancelar Processo...')
    if (configurarConta) {

      setAtivaFormsLogin(false)
      setCriarUser(false)
      infoDadosAtualizado(false)

      AtivarLinksPosAtualizarDadosUser(true)

    } else {
      // Reativa o botão para criar um novo usuário na página principal de login
      setBtnCriarNovoUserAtivo(true) 

      if (criarUser) {
        setCriarUser(false)
      }
    }    
  }

  return (

    <div className='login-divPrincipal'>

        {/** PROCESSO PARA CRIAR UM NOVO LOGIN. */}
        <div className='login-divInputs'>
          {criarUser && (            <>            
            {configurarConta ?

            // Bloco para configurar os dados do usuário logado.
            <div className='login-divCriarLogin'>
              <h1> Configurar sua conta </h1>
              
              {/* NOME COMPLETO */}
              
              <div className='login-divGridInputs'>
                
                <label htmlFor="nomeCompleto" className='login-lblCadastro login-lblNomeCompleto'>
                  Nome Completo
                  <input type="text" name='nomeCompleto' className='login-inputCadastro login-inputNomecompleto' 
                  value={ncNomeCompleto}
                  onChange={e => setNcNomeCompleto(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      salvarNovoUser();
                      }
                    }
                  }
                  />
                </label>
              </div>
              
              {/* USUARIO */}
              <div className='login-divGridInputs'>
                <label htmlFor="nomeUserLogin" className='login-lblCadastro login-lblUsuarioLogin'>
                  Usuário Login
                  <input type="text" name='nomeUserLogin' className='login-inputCadastro login-inputUserLogin' 
                  value={ncUsuario}
                  onChange={e => setNcUsuario(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      salvarNovoUser();
                      }
                    }
                  }
                  />
                </label>
              </div>
              
              {/* E-MAIL */}
              <div className='login-divGridInputs' >
                <label htmlFor='email' className='login-lblCadastro login-lblEmailLogin'>
                  E-mail
                  <input type="email" name='email' className='login-inputCadastro login-inputEmail' 
                  value={ncEmail}
                  onChange={e => setNcEmail(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      salvarNovoUser();
                      }
                    }
                  }
                  />
                </label>
              </div>
              
              {/* SENHA 1 */}
              <div className='login-divGridInputs'>
                <label htmlFor='senha' className='login-lblCadastro login-lblSenhaLogin'>
                  Password
                  <input type="password" name='senha' className='login-inputCadastro login-inputSenha'
                  value={ncPrimeiraSenha}
                  onChange={e => setNcPrimeiraSenha(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      salvarNovoUser();
                      }
                    }
                  }
                  />
                </label>
              </div>
              
              {/* SENHA 2 */}
              <div className='login-divGridInputs'>
                <label htmlFor='confirm-senha' className='login-lblCadastro login-lblConfirmSenha'>
                  Confirmar Password
                  <input type="password" name='confirm-senha' className='login-inputCadastro login-inputConfirSenha' 
                  value={ncConfirSenha}
                  onChange={e => setNcconfirSenha(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      salvarNovoUser();
                      }
                    }
                  }
                  />
                </label>
            </div>

            {/* BOTOES */}
              <div className="login-divBtnsNovoUsuario">
                <FaBackspace className="login-btnCancelar login-btnCadastrar" title='Cancelar' onClick={cancelar}/>
                <AiOutlineClear className="login-btnLimparforms login-btnCadastrar" title='Limpar Formulário' onClick={limparFormulario}/>
                <GrUpdate className="login-btnAtualizar login-btnCadastrar" title='Cancelar' onClick={atualizarCadastros}/>
              </div>
            </div>

          :

          // Bloco para criar um novo usuário.
          <div className='login-divCriarLogin'>

            <h1> Cadastro </h1>
            <div className='login-divGridInputs'>

              {/* NOME COMPLETO */}
              <label htmlFor="nomeCompleto" className='login-lblCadastro login-lblNomeCompleto'>
                Nome Completo
                <input type="text" name='nomeCompleto' className='login-inputCadastro login-inputNomecompleto' 
                value={ncNomeCompleto}
                onChange={e => setNcNomeCompleto(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    salvarNovoUser();
                    }
                  }
                }
                />
              </label>
            </div>
            
            {/* USUÁRIO */}
            <div className='login-divGridInputs'>
              <label htmlFor="nomeUserLogin" className='login-lblCadastro login-lblUsuarioLogin'>
                Usuário Login
                <input type="text" name='nomeUserLogin' className='login-inputCadastro login-inputUserLogin' 
                value={ncUsuario}
                onChange={e => setNcUsuario(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    salvarNovoUser();
                    }
                  }
                }
                />
              </label>
            </div>
            
            {/* E-MAIL */}
            <div className='login-divGridInputs' >
              <label htmlFor='email' className='login-lblCadastro login-lblEmailLogin'>
                E-mail
                <input type="email" name='email' className='login-inputCadastro login-inputEmail' 
                value={ncEmail}
                onChange={e => setNcEmail(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    salvarNovoUser();
                    }
                  }
                }
                />
              </label>
            </div>
            
            {/* SENHA 1 */}
            <div className='login-divGridInputs'>
              <label htmlFor='senha' className='login-lblCadastro login-lblSenhaLogin'>
                Password
                <input type="password" name='senha' className='login-inputCadastro login-inputSenha'
                value={ncPrimeiraSenha}
                onChange={e => setNcPrimeiraSenha(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    salvarNovoUser();
                    }
                  }
                }
                />
              </label>
            </div>
            
            {/* SENHA 2 */}
            <div className='login-divGridInputs'>
              <label htmlFor='confirm-senha' className='login-lblCadastro login-lblConfirmSenha'>
                Confirmar Password
                <input type="password" name='confirm-senha' className='login-inputCadastro login-inputConfirSenha' 
                value={ncConfirSenha}
                onChange={e => setNcconfirSenha(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    salvarNovoUser();
                    }
                  }
                }
                />
              </label>
            </div>

            {/* BOTOES */}
            <div className="login-divBtnsNovoUsuario">
              <FaBackspace className="login-btnCancelar login-btnCadastrar" title='Cancelar' onClick={cancelar}/>
              <AiOutlineClear className="login-btnLimparforms login-btnCadastrar" title='Limpar Formulário' onClick={limparFormulario}/>
              <GrUpdate className="login-btnAtualizar login-btnCadastrar" title='Cancelar'/>
              <FaSave className="login-btnSaveNovoUser login-btnCadastrar" onClick={salvarNovoUser} />
            </div>
          </div>
          }</>)
        }

        {/** Processo para logar o usuário */}
        {!criarUser && <div className='login-divLogin'>
            <h1> Login do usuário </h1>

            {
              !ativaFormsLogin ? <h3> { msnAlerta } </h3> :
              ativaFormsLogin && <h3> Usuário logado: {nomeUsuario}... </h3>
            }

            <div className='login-divGridInputs'>
              <label htmlFor="usuario" className='login-lblLoginPrincipal'>
                Usuário
                <input type="text" 
                  name='usuario' 
                  className='login-inputEntrar login-inputUsuario'
                  value={dadosParaLogin.userLogin}
                  onChange={e => setDadosParaLogin({ ...dadosParaLogin, userLogin: e.target.value})}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      eventoLogin();
                      }
                    }
                  }
                />
              </label>
            </div>
            
            <div className='login-divGridInputs'>
              <label htmlFor="senha" className='login-lblLoginPrincipal'>
                Password
                <input type="password"
                  name='senha'
                  className='login-inputEntrar login-inputSenha'
                  value={dadosParaLogin.passLogin}
                  onChange={e => setDadosParaLogin({ ...dadosParaLogin, passLogin: e.target.value})}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      eventoLogin();
                      }
                    }
                  } 
                  />
                </label>
            </div>
            
            <div className='login-divBtnLoginPrincipal'>
              <GiConfirmed className="login-btnLogar login-btnVerificar" title='Logar' onClick={eventoLogin}/>
              {
                btnCriarNovoUserAtivo &&
                <GrUserNew className="login-btnLogar login-btnCriarNovoUser" title='Criar Conta' onClick={criarNovoUsuario} /> 
              }
            </div>
        </div>}
      </div>
    </div>
  )
}

export default LoginUsuario