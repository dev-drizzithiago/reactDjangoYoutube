import './LoginUsuario.css';
import { useState, useEffect } from 'react';
import sendRequestDjango from './sendRequestDjango';
import LinkBancoDados from './LinkBancoDados';

const LoginUsuario = ({infoStatusLogin}) => {
  const [criarUser, setCriarUser] = useState(false)
  const [btnCriarNovoUserAtivo, setBtnCriarNovoUserAtivo] = useState(true)
  const [dadosNovoUser, setDadosNovoUser] = useState([])
  const [dadosParaLogin, setDadosParaLogin] = useState([])
  const [statusLogin, setStatusLogin] = useState(null);

  const criarNovoUsuario = () => {
    setBtnCriarNovoUserAtivo(false)
    setCriarUser(true)
  }

  /** FUNÇÃO PARA SALVAR CREDENCIAIS. */
  const salvarNovoUser = async () => {    

    if (dadosNovoUser.primeiraSenha === dadosNovoUser.confirmSenha) {
      setBtnCriarNovoUserAtivo(true)      

      if (criarUser) {
        setCriarUser(false)
      }

      const linkSendRequest = `http://localhost:8000/credenciais_login/`;

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
      console.log('As senhas não confere!')
    }
  }
  
  /** Função para o usuário se logar  */
  const eventoLogin = async () => {

    const linkSendRequest = `http://localhost:8000/credenciais_login/`;

    if (dadosParaLogin.length === 0) {
      console.log('Entre com Login e Senha')
    }
    else if (dadosParaLogin.userLogin === undefined) {
      console.log('Entre com Login')
    }
    else if (dadosParaLogin.passLogin === undefined) {
      console.log('Entre com sua Senha')
    }
    else {
      const PAYLOAD = {
        'tipoRequest': 'realizarLogin',
        'dadosCredencial': {
          'userLogin': dadosParaLogin.userLogin,
          'passUsuario': dadosParaLogin.passLogin, 
        },
      }
      console.log('Processando login...')
      const responseDjango = await sendRequestDjango(linkSendRequest, PAYLOAD)

      console.log(responseDjango)

      if (responseDjango !== undefined) {
        if (Number(responseDjango.erro_processo) !== 1) {
          if (responseDjango.nome_usuario === 'AnonymousUser'){
            console.log(responseDjango.mensagem_erro)
            infoStatusLogin(false)
          } else if (responseDjango.usuario_logado) {
            infoStatusLogin(responseDjango.usuario_logado)
          }
        } else {
            console.log(responseDjango.mensagem_erro)
        }
      }
    }
  }

  return (
    <div className='login-divPrincipal'>
      <h1>Cadastro</h1>
        {/** PROCESSO PARA CRIAR UM NOVO LOGIN. */}
        <div className='login-divInputs'>
          {criarUser && <div className='login-divCriarLogin'>
          <h3>Cadastro</h3>
          <div className='login-divGridInputs'>
            <label htmlFor="nomeCompleto">Nome Completo</label>              
            <input type="text" name='nomeCompleto' className='login-input login-inputNomecompleto' 
            value={dadosNovoUser.nomeCompleto}
            onChange={e => setDadosNovoUser({ ...dadosNovoUser, nomeCompleto: e.target.value})}
            />
          </div>

          <div className='login-divGridInputs'>
            <label htmlFor="nomeUserLogin">Usuário Login</label>              
            <input type="text" name='nomeUserLogin' className='login-input login-inputUserLogin' 
            value={dadosNovoUser.UserLogin}
            onChange={e => setDadosNovoUser({ ...dadosNovoUser, UserLogin: e.target.value})}
            />
          </div>
          
          <div className='login-divGridInputs'>
            <label htmlFor='email'>E-mail</label>              
            <input type="email" name='email' className='login-input login-inputEmail' 
            value={dadosNovoUser.novoEmail}
            onChange={e => setDadosNovoUser({ ...dadosNovoUser, novoEmail: e.target.value})}
            />
          </div>
          
          <div className='login-divGridInputs'>
            <label htmlFor='senha'>Password</label>
            <input type="password" name='senha' className='login-input login-inputSenha'
            value={dadosNovoUser.primeiraSenha}
            onChange={e => setDadosNovoUser({ ...dadosNovoUser, primeiraSenha: e.target.value})}
            />              
          </div>
          
          
          <div className='login-divGridInputs'>
            <label htmlFor='confirm-senha'>Confirmar Password</label>                
              <input type="password" name='confirm-senha' className='login-input login-inputConfirSenha' 
              value={dadosNovoUser.confirmSenha}
              onChange={e => setDadosNovoUser({ ...dadosNovoUser, confirmSenha: e.target.value})}
              onKeyUp={salvarNovoUser}
              />              
            </div>            

          <img className="login-btnNewUser" src="/img/imgBtns/salve.png" alt="criarNovoUsuario" title='Criar Usuário' onClick={salvarNovoUser}/>
        </div>}

        {/** Processo para logar o usuário */}
        {!criarUser && <div className='login-divLogin'>
            <h3>Login</h3>

            <div className='login-divGridInputs'>
              <label htmlFor="usuario">Usuário</label>              
              <input type="text" 
              name='usuario' 
              className='login-input login-inputUsuario'
              value={dadosParaLogin.userLogin}
              onChange={e => setDadosParaLogin({ ...dadosParaLogin, userLogin: e.target.value})}
              />
              
            </div>
            
            <div className='login-divGridInputs'>
              <label htmlFor="senha">Senha</label>
              <input type="password" 
              name='senha' 
              className='login-input login-inputSenha'
              value={dadosParaLogin.passLogin}
              onChange={e => setDadosParaLogin({ ...dadosParaLogin, passLogin: e.target.value})}
              onKeyUp={eventoLogin}              />
              
            </div>
                    
            <img className="login-btnNewUser login-btnVerificar" 
            src="/img/imgBtns/verificar.png" 
            alt="logar" 
            title='Logar' 
            onClick={eventoLogin}
            />            
            {
              btnCriarNovoUserAtivo &&
              <img className="login-btnNewUser login-btnCriarNovoUser" 
              src="/img/imgBtns/adicionar-usuario.png" 
              alt="criar usuario" 
              onClick={criarNovoUsuario} 
              /> 
            }          
        </div>}
      </div>
    </div>
  )
}

export default LoginUsuario