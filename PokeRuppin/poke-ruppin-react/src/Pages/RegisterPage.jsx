import { useState } from "react"
import { useParams } from "react-router-dom"

const labelTxt = 'Boy Girl Semi-Boy Semi-Girl Wizard Robot Alien Unicorn Potato Dinosaur Spy'
const labels = labelTxt.split(' ')

export default function RegisterPage() {
  const params = useParams()

  const [genders, setGender] = useState([])

  const genderChange = (event) => {
    const value = event.target.value
    setGender(prevState =>
      prevState.includes(value)
        ? prevState.filter(gender => gender !== value)
        : [...prevState, value]
    )
  }

//STOPPED HERE

  return (
    
    <div className="registerPage">
      <div className="registerPageContainer">
        <div className="gender">
          I am a: 
          <div className="radios">
            {labels.map((eachLabel, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={eachLabel}
                  checked={genders.includes(eachLabel)}
                  onChange={genderChange}
                />
                {eachLabel}
              </label>
            ))}
          </div>
        </div>
        <div className="born"></div>
        <div className="robotCheck"></div>
        <div className="happy"></div>
      </div>
    </div>
  )
}
