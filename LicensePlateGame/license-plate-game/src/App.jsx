import { useEffect, useState } from 'react'
import './App.css'
import Games from './FuncComps/Games'

function App() {

  const [plate, setPlate] = useState(null)
  const [numbers, setNumbers] = useState(null)

  const symboles = ['+', '-', '*', '/', '%', 'xʸ', '✂️', '🖇']
  const [selectedSymbole, setSelectedSymbole] = useState('+');
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [result, setResult] = useState(null)

  const clickOnNumber = (index) => {
    if (selectedNumbers.includes(index)) {
      setSelectedNumbers(selectedNumbers.filter(number => number != index))
    }
    else {
      if (selectedNumbers.length > 1) {
        let tempSelectedNumbers = selectedNumbers
        tempSelectedNumbers.pop()
        setSelectedNumbers([...tempSelectedNumbers, index])
        return
      }
      setSelectedNumbers([...selectedNumbers, index])
    }
  }

  const validateCalc = (result) => {
    let tempSelectedIndexes = selectedNumbers
    let tempNumbers = numbers
    while (tempSelectedIndexes.length > 0)
      tempNumbers.splice(tempSelectedIndexes.pop(), 1)
    if (Array.isArray(result)) {
      tempNumbers = [...tempNumbers, ...result]
    } else {
      tempNumbers.push(result)
    }


    setNumbers(tempNumbers)
    setSelectedNumbers([])
    setSelectedSymbole()
  }

  const calc = () => {


    if (!selectedSymbole || selectedNumbers.length == 0) {
      return
    }

    let result = 0


    switch (selectedSymbole) {
      case '✂️':
        if (selectedNumbers.length > 1) {
          let tempSelectedNumbers = selectedNumbers
          while (tempSelectedNumbers.length > 1) {
            tempSelectedNumbers.pop();
          }
          setSelectedNumbers(tempSelectedNumbers)
        }
        result = numbers[selectedNumbers[0]].toString().split('').map(d => parseInt(d));
        break;
      default:
        if (selectedNumbers.length == 1)
          return
    }




    //function for 2 numbers
    if (selectedNumbers.length == 2) {
      const firstNum = numbers[selectedNumbers[0]] - 0
      const secondNum = numbers[selectedNumbers[1]] - 0
      switch (selectedSymbole) {
        case '+':
          result = firstNum + secondNum
          break;
        case '-':
          result = firstNum - secondNum
          break;
        case '*':
          result = firstNum * secondNum
          break;
        case '/':
          result = Math.floor(firstNum / secondNum)
          break;
        case '%':
          result = firstNum % secondNum
          break;
        case 'xʸ':
          result = Math.pow(firstNum, secondNum)
          break;
        case '🖇':
          result = firstNum + '' + secondNum
          break;
      }
    }

    console.log(result);


    return <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
      <p style={{ fontSize: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{'= ' + (Array.isArray(result) ? result.join(' - ') : result)}</p>
      <p style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px',
        backgroundColor: 'rgb(6, 82, 20)', cursor: 'pointer'
      }} onClick={() => validateCalc(result)}>✅</p>
    </div>
  }



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ marginBottom: '200px' }}>
        <input type="text" onChange={(e) => setPlate(e.target.value)}
          style={{ fontSize: 25, textAlign: 'center' }} />
        <button onClick={() => setNumbers(plate ? plate.split('').filter(number => number != '-') : [])}>Validate</button>
      </div>
      

       <Games plate={'251-50-512'}></Games>
    </div >
  )
}
export default App
