import './LoginUsuario.css';
import { useState } from 'react';
import {  logarUsuario } from './statusLoginDjango';

// - Importa as actions criadas no slice.
import { loginSuccess } from './sessionSlice';

//- useSelector → acessa o estado global do Redux.
//- useDispatch → dispara actions para alterar o estado.
import { useDispatch } from 'react-redux';

import { FaSave } from "react-icons/fa";
import { TbUserCancel } from "react-icons/tb";
import { GrUpdate } from "react-icons/gr";

import { GrUserNew } from "react-icons/gr";
import { GiConfirmed } from "react-icons/gi";

import { toast } from 'react-toastify';

const urlDefaultDjango = `http://localhost:8080`

const LoginUsuario = ({infoStatusLogin}) => {

  const [criarUser, setCriarUser] = useState(false)
  const [btnCriarNovoUserAtivo, setBtnCriarNovoUserAtivo] = useState(true)
  const [dadosNovoUser, setDadosNovoUser] = useState([])
  const [dadosParaLogin, setDadosParaLogin] = useState([])
  const [msnAlerta, setMsgAlerta] = useState('Entre com suas credenciais')

  const [botaoAtivado, setBotaoAtivado] = useState(false)

  const dispatch = useDispatch()

  // Quanto ativa o botão para criar novo usuário. Abre o bloco de formulário
  const criarNovoUsuario = () => {
    setBtnCriarNovoUserAtivo(false)
    setCriarUser(true)
  }

  /** FUNÇÃO PARA SALVAR CREDENCIAIS. */
  const salvarNovoUser = async () => {

    if (dadosNovoUser.primeiraSenha === dadosNovoUser.confirmSenha) {
      setBtnCriarNovoUserAtivo(true)  // O elemento fecha e o botão para criar novo usuário é aberto;

      if (criarUser) {
        setCriarUser(false)
      }

      const linkSendRequest = `${urlDefaultDjango}/credenciais_login/`;

      const PAYLOAD = {
        'tipoRequest': 'salvarCadastro',
        'dadosCredencial': {
          'nomeUsuario': dadosNovoUser.nomeCompleto,
          'userLogin': dadosNovoUser.UserLogin,
          'emailUsuario': dadosNovoUser.novoEmail,
          'passUsuario': dadosNovoUser.confirmSenha, 
        },
      }
      
      console.log(PAYLOAD)
      const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)
      console.log(responseDjango)

    } else {
      toast.error('As senhas não confere!')
    }
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
          if (Number(responseDjango.erro_processo) === 2) {
            
            toast.error(responseDjango.mensagem_erro)

          } else if (Number(responseDjango.erro_processo) !== 1) {
            if (responseDjango.nome_usuario === 'AnonymousUser'){
              
              // Retorna o valor para o app
              infoStatusLogin(false)

            } else if (responseDjango.usuario_logado) {
              toast.warning('Login realizado com sucesso...')

              infoStatusLogin(responseDjango.usuario_logado)

              // sessionStorage.setItem('usuarioLogado', responseDjango.usuario_logado);
              dispatch(loginSuccess(responseDjango.usuario_logado));
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
              value={dadosNovoUser.nomeCompleto}
              onChange={e => setDadosNovoUser({ ...dadosNovoUser, nomeCompleto: e.target.value})}
              />
            </label>
          </div>

          <div className='login-divGridInputs'>
            <label htmlFor="nomeUserLogin" className='login-lblCadastro login-lblUsuarioLogin'>
              Usuário Login
              <input type="text" name='nomeUserLogin' className='login-inputCadastro login-inputUserLogin' 
              value={dadosNovoUser.UserLogin}
              onChange={e => setDadosNovoUser({ ...dadosNovoUser, UserLogin: e.target.value})}
              />
            </label>              
            
          </div>
          
          <div className='login-divGridInputs' >
          <label htmlFor='email' className='login-lblCadastro login-lblEmailLogin'>
            E-mail
            <input type="email" name='email' className='login-inputCadastro login-inputEmail' 
            value={dadosNovoUser.novoEmail}
            onChange={e => setDadosNovoUser({ ...dadosNovoUser, novoEmail: e.target.value})}
            />
          </label>
          </div>
          
          <div className='login-divGridInputs'>
            <label htmlFor='senha' className='login-lblCadastro login-lblSenhaLogin'>
              Password
              <input type="password" name='senha' className='login-inputCadastro login-inputSenha'
              value={dadosNovoUser.primeiraSenha}
              onChange={e => setDadosNovoUser({ ...dadosNovoUser, primeiraSenha: e.target.value})}
              />
            </label>
          </div>          
          
          <div className='login-divGridInputs'>
            <label htmlFor='confirm-senha' className='login-lblCadastro login-lblConfirmSenha'>
              Confirmar Password
              <input type="password" name='confirm-senha' className='login-inputCadastro login-inputConfirSenha' 
              value={dadosNovoUser.confirmSenha}
              onChange={e => setDadosNovoUser({ ...dadosNovoUser, confirmSenha: e.target.value})}
              onKeyUp={salvarNovoUser}
              />
            </label>
          </div>
          <div className="login-divBtnsNovoUsuario">
            <TbUserCancel className="login-btnCancelar login-btnCadastrar" title='Cancelar' onClick={cancelar}/>
            <GrUpdate className="login-btnAtualizar login-btnCadastrar" title='Cancelar'/>
            <FaSave className="login-btnSaveNovoUser login-btnCadastrar" onClick={salvarNovoUser} />
          </div>
        </div>}

        {/** Processo para logar o usuário */}
        {!criarUser && <div className='login-divLogin'>
            <h1>Login</h1>
            <h3> {msnAlerta} </h3>
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
                <GrUserNew className="login-btnLogar login-btnCriarNovoUser" onClick={criarNovoUsuario} /> 
              }
            </div>
        </div>}
      </div>
    </div>
  )
}

export default LoginUsuario