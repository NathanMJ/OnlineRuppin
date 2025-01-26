import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const labelTxt = 'Boy Girl Semi-Boy Semi-Girl Wizard Robot Alien Unicorn Potato Dinosaur Spy'
const labels = labelTxt.split(' ')

export default function RegisterPage(props) {
  const params = useParams()

  const [genders, setGender] = useState([])
  const [birthDate, setBirthDate] = useState()
  const [isRobot, setIsRobot] = useState()
  const [isHappy, setIsHappy] = useState(false)
  const [cursorType, setCursorType] = useState('pointer');
  
  const [message, setMessage] = useState();



  const genderChange = (event) => {
    const value = event.target.value
    setGender(prevState =>
      prevState.includes(value)
        ? prevState.filter(gender => gender !== value)
        : [...prevState, value]
    )
  }

  const dateInput = () => {
    return (
      <div className="date-container">
        <input type="date" id="dateInput" className="date-input" onChange={(e) => setBirthDate(e.target.value)} />
      </div>
    );
  }

  const legalAge = () => {
    // Vérifie si birthDate est une date valide
    if (!birthDate || isNaN(new Date(birthDate).getTime())) {
      return false;
    }

    const now = new Date();
    const birth = new Date(birthDate);

    // Calcule l'âge en années
    const ageInYears = now.getFullYear() - birth.getFullYear();

    // Ajuste l'âge si l'anniversaire n'a pas encore eu lieu cette année
    const hasBirthdayPassed = now.getMonth() > birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
    const adjustedAge = hasBirthdayPassed ? ageInYears : ageInYears - 1;

    return adjustedAge >= 13; // Vérifie si l'âge est supérieur ou égal à l'âge requis
  };

  const checkRobot = () => {
    setCursorType('wait')
    
    setTimeout(() => {
      setIsRobot(genders.includes('Robot'))
      setCursorType('pointer')
    }, 2000)
  }

  const tryToRegister = () => {
    if(genders.length == 0){
      setMessage('Please enter your gender')
    }
    else if(genders.length < 2){
      setMessage('Please enter at least two genders. We are in 2025...')
    }
    else if(!birthDate){
      setMessage("Please enter your birthdate")
    }
    else if(!legalAge()){
      setMessage("You don't have the age to play a this game")
    }
    else if(isRobot == undefined){
      setMessage("We didn't check if you were a robot")
    }    
    else if(isRobot && !genders.includes('Robot')){
      setMessage("Please check again if you are a robot")
    }    
    else if(isRobot){
      setMessage('Robot are not allowed to play at this game...')
    }
    else if(genders.includes('Robot')){
      setMessage("You are trying to lie to me !")
    }
    else if(!isHappy){
      setMessage('You have to be happy to play at this game.')
    }

    if(false){
      
    }
    else{
      setMessage('Connecting...')
      setTimeout(()=>{
        props.goto(`/menuPage/${params.name}`)
      }, 1000 )
    }
  }

  useEffect(()=>{
    console.log(isHappy);    
  },[isHappy])

  return (
    <div className="registerPage">
      <div className="registerPageContainer">
        <div className="gender">
          <h1>I am a:</h1>
          <div className="radios">
            {labels.map((eachLabel, index) => (
              <label key={index} className={`${eachLabel == 'Robot' ? 'robotLabel' : ''}`}  >
                <input
                  type="checkbox"
                  value={eachLabel}
                  checked={genders.includes(eachLabel)}
                  onChange={genderChange} />
                {eachLabel}
              </label>
            ))}
          </div>
        </div>
        <div className="born">
          <h1>I was born in :</h1>
          {dateInput()}
          <div>
            <h2 className="correct" style={{ color: birthDate ? (legalAge() ? 'green' : 'grey') : 'grey' }}>Correct age</h2>
            <h2 className="uncorrect" style={{ color: birthDate ? (legalAge() ? 'gray' : 'red') : 'grey' }}>Uncorrect age</h2>
            <h2 style={{ color: birthDate ? (legalAge() ? 'green' : 'red') : 'grey' }}>to play</h2>
          </div>
          <h2></h2>
        </div>
        <div className="robotCheck">
          <h1>I am not a robot :</h1>
          <button className="checkRobotBtn" style={{ cursor: cursorType }} onClick={checkRobot}>Check</button>
          <h1 className="notRobot" style={{ color: isRobot != undefined ? (!isRobot ? 'green' : 'gray') : 'grey' }}>Correct !</h1>
          <h1 className="isRobot" style={{ color: isRobot != undefined ? (!isRobot ? 'gray' : 'red') : 'grey' }}>Liar !</h1>
        </div>
        <div className="happy">
          <label>
            <input type="checkbox" onChange={(e)=>{setIsHappy(e.target.checked)}}/>I am happy to play at the PokeRuppin Game !
          </label>
        </div>
        <div className="message">{message}</div>
        <div className="buttonContainer">
          <button onClick={tryToRegister}>Start the adventure !</button>
        </div>
      </div>
    </div>
  )
}
