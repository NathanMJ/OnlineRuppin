import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const labelTxt = 'Boy Girl Semi-Boy Semi-Girl Wizard Robot Alien Unicorn Potato Dinosaur Spy'
const labels = labelTxt.split(' ')

export default function RegisterPage() {
  const params = useParams()

  const [genders, setGender] = useState([])
  const [birthDate, setBirthDate] = useState()
  const [isRobot, setIsRobot] = useState()


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

  useEffect(() => {
    if (birthDate) {
      console.log('correct age : ', legalAge());
    }
  }, [birthDate])

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
    setIsRobot(!genders.includes('Robot'))
  }

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
          <button className="checkRobotBtn" onClick={checkRobot}>Check</button>
          <h1 className="notRobot" style={{ color: isRobot != undefined ? (isRobot ? 'green' : 'gray') : 'grey' }}>Correct !</h1>
          <h1 className="isRobot" style={{ color: isRobot != undefined ? (isRobot ? 'gray' : 'red') : 'grey' }}>Liar !</h1>
        </div>
        <div className="happy"></div>
        <div className="buttonContainer">
          <button>Start the adventure !</button>
        </div>
      </div>
    </div>
  )
}
