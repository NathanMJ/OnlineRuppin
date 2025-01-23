export default function LoginRegisterPage() {
  return (
    <div className="loginRegisterPage">
      {/* <RegisterSide></RegisterSide>
      <LoginSide></LoginSide> 
      I know to do like that but I wanted that the left and the right side are facing */}
      <img src="./src/Pictures/Logos/register.png" alt="register-logo" />

      <img src="./src/Pictures/Logos/login.png" alt="login-logo" />

      <div>
        <input type="text" maxLength={12} placeholder='PokeName' />
        <input type="text" maxLength={12} placeholder='PokeEmail' />
        <input type="password" maxLength={12} placeholder='PokePassword' />
        <p className='errorMessage'>One of the fields is not correct</p>
      </div>
      <div>
        <input type="text" maxLength={12} placeholder='PokeEmail' />
        <input type="password" maxLength={12} placeholder='PokePassword' />
        <p className='errorMessage'>One of the fields is not correct</p>
      </div>

      <button className='loginButton'>Continu the adventure !</button>

      <button className='registerButton'>Start the adventure !</button>


      <div className="separationLine"></div>

    </div>
  )
}
