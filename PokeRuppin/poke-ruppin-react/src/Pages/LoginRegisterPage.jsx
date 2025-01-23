import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginRegisterPage(props) {

const navigate = useNavigate()

  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  
  const [loginName, setLoginName] = useState('')


  const tryRegister = () => {
    
  }


  return (
    <div className="loginRegisterPage">
      {/* <RegisterSide></RegisterSide>
      <LoginSide></LoginSide> 
      I know to do like that but I wanted that the left and the right side are facing */}

      <img src="./src/Pictures/Logos/register.png" alt="register-logo" />

      <img src="./src/Pictures/Logos/login.png" alt="login-logo" />

      <div>
        <input type="text" onChange={(e) => { setRegisterName(e.target.value) }} maxLength={12} placeholder='PokeName' />
        <input type="text" onChange={(e) => { setRegisterEmail(e.target.value) }} maxLength={12} placeholder='PokeEmail' />
        <input type="password" onChange={(e) => { setRegisterPassword(e.target.value) }} maxLength={12} placeholder='PokePassword' />
      </div>
      <div>
        <input type="text" maxLength={12} placeholder='PokeEmail' />
        <input type="password" maxLength={12} placeholder='PokePassword' />
      </div>

      <p className='errorRegisterMessage'> </p>
      <p className='errorLoginMessage'> </p>

      <button onClick={tryRegister} className='registerButton'>Start the adventure !</button>
      <button className='loginButton'>Continu the adventure !</button>



      <div className="separationLine"></div>

    </div>
  )
}
