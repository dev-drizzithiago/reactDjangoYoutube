import './LoginUsuario.css'
import { useState, useEffect } from 'react'

const LoginUsuario = () => {
  const [criarUser, setCriarUser] = useState(false)
  const [btnCriarNovoUserAtivo, setBtnCriarNovoUserAtivo] = useState(true)
  const [dadosNovoUser, setDadosNovoUser] = useState([])

  const criarNovoUsuario = () => {
    setBtnCriarNovoUserAtivo(false)
    setCriarUser(true)
  }

  const salvarNovoUser = () => {
    const PAYLOAD = {
      'tipoRequest': 'salvarCadastro',
      'dadosNovaCredencia': ''
    }

    if (dadosNovoUser.primeiraSenha === dadosNovoUser.confirmSenha) {
      setBtnCriarNovoUserAtivo(true)
      if (criarUser) {
        setCriarUser(false)
      }
    } else {
      console.log('As senhas não confere!')
    }
  }
  
  return (
    <div>
        <h1>Cadastro</h1>        
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
                />              
              </div>            

            <img className="login-btnNewUser" src="/img/imgBtns/salve.png" alt="" onClick={salvarNovoUser}/>
          </div>}

          {!criarUser && <div className='login-divLogin'>
              <h3>Login</h3>

              <div className='login-divGridInputs'>
                <label htmlFor="usuario">Usuário</label>              
                <input type="text" name='usuario' className='login-input login-inputUsuario'/>            
              </div>
              
              <div className='login-divGridInputs'>
                <label htmlFor="senha">Senha</label>
                <input type="password" name='senha' className='login-input login-inputSenha'/>
              </div>
                     
              <img className="login-btnNewUser login-btnVerificar" src="/img/imgBtns/verificar.png" alt="" />
              {
                btnCriarNovoUserAtivo &&
                <img className="login-btnNewUser login-btnCriarNovoUser" 
                src="/img/imgBtns/adicionar-usuario.png" alt="criar usuario" onClick={criarNovoUsuario} /> 
              }          
          </div>}
        </div>
    </div>
  )
}

export default LoginUsuario