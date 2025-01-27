import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginRegisterPage(props) {



  const [registerName, setRegisterName] = useState('Nathan')
  const [registerEmail, setRegisterEmail] = useState('nathan@gmail.com')
  const [registerPassword, setRegisterPassword] = useState('123')

  const [loginName, setLoginName] = useState('Nathan')
  const [loginPassword, setLoginPassword] = useState('')


  const [regMess, setRegMess] = useState(' ')
  const [logMess, setLogMess] = useState(' ')

  console.log(props.pokeUsers);
  

  const tryRegister = () => {

    //check the fields are not empty
    if (registerName == '' && registerEmail == '' && registerPassword == '') {
      setRegMess('Every field is empty')
    }
    else if (registerName == '' || registerEmail == '' || registerPassword == '') {
      setRegMess('One of the fieds is empty')
    }
    else if (props.pokeUsers.some(eachPokeUser=> eachPokeUser.name == registerName)){
      setRegMess('Username already exist')
    }
    else if (!isEmail(registerEmail)) {
      setRegMess('Wrong email')
    }
    else if (props.pokeUsers.some(eachPokeUser=> eachPokeUser.email == registerEmail)){
      setRegMess('Mail already used')
    }
    else {
      props.goto(`/registerPage/${registerName}/${registerEmail}/${registerPassword}`)
    }



    setTimeout(() => { setLogMess('') }, 2000)

  }

  const isEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    /* [^\s@] => everything but not space or @*/
    return regex.test(email)
  }

  const tryLogin = () => {
    console.log(props.canLogin(loginName,loginPassword));
    
    if (props.canLogin(loginName, loginPassword)) {
      setLogMess('Connecting')
      props.goto(`/menuPage/${loginName}`)
    }
    else{
      setLogMess('Error in one of the fields')
    }
  }

  return (
    <div className="loginRegisterPage">
      {/* <RegisterSide></RegisterSide>
      <LoginSide></LoginSide> 
      I know to do like that but I wanted that the left and the right side are facing */}

      <img src="./src/Pictures/Logos/register.png" alt="register-logo" />

      <img src="./src/Pictures/Logos/login.png" alt="login-logo" />

      <div>
        <input type="text" onChange={(e) => { setRegisterName(e.target.value) }} maxLength={18} placeholder='PokeName' />
        <input type="text" onChange={(e) => { setRegisterEmail(e.target.value) }} placeholder='PokeEmail' />
        <input type="password" onChange={(e) => { setRegisterPassword(e.target.value) }} maxLength={18} placeholder='PokePassword' />
      </div>
      <div>
        <input type="text" onChange={(e) => { setLoginName(e.target.value) }} maxLength={18} placeholder='PokeName' />
        <input type="password" onChange={(e) => { setLoginPassword(e.target.value) }} maxLength={18} placeholder='PokePassword' />
      </div>

      <p className='errorRegisterMessage'>{regMess}</p>
      <p className='errorLoginMessage'>{logMess}</p>

      <button onClick={tryRegister} className='registerButton'>Start the adventure !</button>
      <button onClick={tryLogin} className='loginButton'>Continu the adventure !</button>



      <div className="separationLine"></div>

    </div>
  )
}
