import './LoginUsuario.css'
import { useState } from 'react'

const LoginUsuario = () => {
  const [criarUser, setCriarUser] = useState(false)

  const criarNovoUsuario = () => {
    setCriarUser(true)
  }

  return (
    <div>
        <h1>Login</h1>        
        <div className='login-divInputs'>

          <h3>Cadastro</h3>
          <div className='login-divCriarLogin'>
            <label htmlFor="nomeCompleto: ">
              Nome Completo
              <input type="password" name='nomeCompleto' className='login-input login-inputNomecompleto'/>
            </label>

            <label htmlFor='email'>
              E-mail
              <input type="emain" name='email' className='login-input login-inputEmail' />
            </label>

            <a href="">
              <img className="login-btnNewUser" src="/img/imgBtns/adicionar-usuario.png" alt="" />
            </a>
          </div>

          <h3>Cadastro</h3>
          <div className='login-divLogin'>
            <label htmlFor="usuario: ">
            Usuário<input type="text" name='usuario' className='login-input login-inputUsuario'/>
          </label>
          <label htmlFor="senha: ">
            Senha<input type="password" name='senha' className='login-input login-inputSenha'/>
          </label>
            <a href="">
              <img className="login-btnNewUser" src="/img/imgBtns/verificar.png" alt="criar usuario" onClick={criarNovoUsuario} />
            </a>
            
          </div>
          
        </div>
    </div>
  )
}

export default LoginUsuario