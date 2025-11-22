import './LoginUsuario.css'

const LoginUsuario = () => {

  const criarNovoUsuario = () => {
    
  }

  return (
    <div>
        <h1>Login</h1>
        <div className='login-divInputs'>
          <label htmlFor="usuario: ">
            Usuário<input type="text" name='usuario' className='login-input login-inputUsuario'/>
          </label>

          <label htmlFor="senha: ">
            Senha<input type="password" name='senha' className='login-input login-inputSenha'/>
          </label>
        </div>        

        <div className=''>
          <a href="">
            <img className="login-btnNewUser" src="/img/imgBtns/adicionar-usuario.png" alt="" />
          </a>
          <a href="">
            <img className="login-btnNewUser" src="/img/imgBtns/verificar.png" alt="" />
          </a>
        </div>
    </div>
  )
}

export default LoginUsuario