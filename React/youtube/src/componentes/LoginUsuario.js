import './LoginUsuario.css'
import { useState, useEffect } from 'react'

const LoginUsuario = () => {
  const [criarUser, setCriarUser] = useState(false)
  const [btnCriarNovoUserAtivo, setBtnCriarNovoUserAtivo] = useState(true)

  const criarNovoUsuario = () => {
    setCriarUser(true)
  }

  const salvarNovoUser = () => {
     if (criarUser) {
      setCriarUser(false)
    }
  }
  
  return (
    <div>
        <h1>Cadastro</h1>        
        <div className='login-divInputs'>          
          {criarUser && <div className='login-divCriarLogin'>
            <h3>Cadastro</h3>
            <label htmlFor="nomeCompleto: ">
              Nome Completo
              <input type="text" name='nomeCompleto' className='login-input login-inputNomecompleto'/>
            </label>
            <label htmlFor='email'>
              E-mail
              <input type="email" name='email' className='login-input login-inputEmail' />
            </label>
            <img className="login-btnNewUser" src="/img/imgBtns/salve.png" alt="" onClick={salvarNovoUser}/>
          </div>}

          <div className='login-divLogin'>
            <h3>Login</h3>
            <label htmlFor="usuario: ">
              Usuário<input type="text" name='usuario' className='login-input login-inputUsuario'/>
            </label>
            <label htmlFor="senha: ">
              Senha<input type="password" name='senha' className='login-input login-inputSenha'/>
            </label>          
              <img className="login-btnNewUser login-btnVerificar" src="/img/imgBtns/verificar.png" alt="" />
              {
                btnCriarNovoUserAtivo &&
                <img className="login-btnNewUser login-btnCriarNovoUser" 
                src="/img/imgBtns/adicionar-usuario.png" alt="criar usuario" onClick={criarNovoUsuario} /> 
              }          
          </div>
        </div>
    </div>
  )
}

export default LoginUsuario