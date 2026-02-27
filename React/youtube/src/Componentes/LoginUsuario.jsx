import './LoginUsuario.css';

import sendRequestDjango from './sendRequestDjango';
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

const LoginUsuario = ({infoStatusLogin}) => {

  const [criarUser, setCriarUser] = useState(false)
  const [btnCriarNovoUserAtivo, setBtnCriarNovoUserAtivo] = useState(true)

  const [ncNomeCompleto, setNcNomeCompleto] = useState('')
  const [ncUsuario, setNcUsuario] = useState('')
  const [ncEmail, setNcEmail] = useState('')
  const [ncPrimeiraSenha, setNcPrimeiraSenha] = useState('')
  const [ncConfirSenha, setNcconfirSenha] = useState('')

  const [dadosParaLogin, setDadosParaLogin] = useState([])
  const [msnAlerta, setMsgAlerta] = useState('Entre com suas credenciais')
  const [ativaFormsLogin, setAtivaFormsLogin] = useState(false);  

  const dispatch = useDispatch()
  const { logado, usuario } = useSelector((state) => state.session)

  useEffect(() => {
    if (usuario) {      
      setAtivaFormsLogin(true)
    } else {
      setAtivaFormsLogin(false)
    }

  }, [logado])

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
      console.log(responseDjango)

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
        console.log(responseDjango.mensagem_erro)
        toast.warning('Erro no processo para criar novo usuário')

      } else if ( responseDjango.erro_processo === 5 ) {

        // Verificar se o usuário já esta cadastrado.
        console.log(responseDjango.mensagem_erro)
        toast.warning(responseDjango.mensagem_erro)

        setTimeout(() => {
          if (criarUser) {
            setCriarUser(false)
          }
        }, 5000)
      } 

      setBtnCriarNovoUserAtivo(true)  // O elemento fecha e o botão para criar novo usuário é aberto;
      
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

            toast.error(responseDjango.mensagem_erro)

          } else if (Number(responseDjango.erro_processo) === 2) {            
            // Credenciais incorretas

            toast.error(responseDjango.mensagem_erro)

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
              dispatch(
                loginSuccess().logado = responseDjango.usuario_logado,
                loginSuccess().payload = responseDjango.nome_usuario,
              );
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
    console.log('Atualizar cadastro...')
  }

  const cancelar = () => {
    console.log('Cancelar Processo...')
    
    // Reativa o botão para criar um novo usuário na página principal de login
    setBtnCriarNovoUserAtivo(true) 

    if (criarUser) {
      setCriarUser(false)
    }
  }

  return (

    <div className='login-divPrincipal'>
        {/** PROCESSO PARA CRIAR UM NOVO LOGIN. */}
        <div className='login-divInputs'>
          {criarUser && <div className='login-divCriarLogin'>
          <h1>Cadastro</h1>
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
          <div className="login-divBtnsNovoUsuario">
            <FaBackspace className="login-btnCancelar login-btnCadastrar" title='Cancelar' onClick={cancelar}/>
            <AiOutlineClear className="login-btnLimparforms login-btnCadastrar" title='Limpar Formulário' onClick={limparFormulario}/>
            <GrUpdate className="login-btnAtualizar login-btnCadastrar" title='Cancelar'/>
            <FaSave className="login-btnSaveNovoUser login-btnCadastrar" onClick={salvarNovoUser} />
          </div>
        </div>}

        {/** Processo para logar o usuário */}
        {!criarUser && <div className='login-divLogin'>
            <h1>Login</h1>

            {!ativaFormsLogin && <h3>{ msnAlerta }</h3> }
            {ativaFormsLogin && <h3>Usuário esta logado, direcionando para a lista de links...  </h3>}

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