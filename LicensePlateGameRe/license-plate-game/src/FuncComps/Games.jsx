import React, { useEffect, useState } from 'react'

export default function Games(props) {

    const [plate, setPlate] = useState(props.plate)

    if (plate == null)
        return

    const [numbers, setNumbers] = useState(null)

    useEffect(() => {
        if (plate)
            setNumbers(plate.split('').filter(number => number != '-'))
    }, [plate])

    const symboles = ['+', '-', '*', '/', '%', 'xʸ', '✂️', '🖇']
    const [selectedSymbole, setSelectedSymbole] = useState();
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



    const styles = {
        numbers: {
            padding: 10,
            backgroundColor: 'rgb(189, 215, 215)',
            color: 'black',
            fontSize: 20
        },
        symbole: {
            padding: 10,
            backgroundColor: 'rgb(189, 215, 215)',
            color: 'black',
            fontSize: 20
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            width: '50vw', gap: '20px'
        }}>
            <div style={{
                display: 'flex', flexDirection: 'row', gap: '5px',
                width: '100%', flexWrap: 'wrap'
            }}>
                {numbers?.length > 0 && numbers.map((number, index) => (
                    <div key={index} onClick={() => clickOnNumber(index)}
                        style={{
                            flex: '1 0 50px', height: '50px', display: 'flex', justifyContent: 'center', position: 'relative',
                            alignItems: 'center', backgroundColor: selectedNumbers?.includes(index) ? 'rgb(52, 85, 155)' : 'gray', cursor: 'pointer', borderRadius: '10px'
                        }}>{number}
                        {selectedNumbers?.includes(index) && <p style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            color: 'rgb(0, 0, 0)',
                            margin: 0,
                            padding: 3,
                            fontSize: '12px',
                            borderRadius: '5px',
                            backgroundColor: 'white',
                            transform: 'translate(50%, -50%)'
                        }}>{selectedNumbers?.findIndex(i => i == index) + 1} </p>}
                    </div>
                ))}
            </div>
            <div style={{
                display: 'flex', flexDirection: 'row', gap: '5px',
                width: '100%', flexWrap: 'wrap'
            }}>
                {symboles.map((symbole, index) => (
                    <div key={index} onClick={() => symbole == selectedSymbole ? setSelectedSymbole() : setSelectedSymbole(symbole)}
                        style={{
                            flex: '1 0 50px', height: '50px', display: 'flex', justifyContent: 'center',
                            alignItems: 'center', backgroundColor: selectedSymbole == symbole ? 'rgb(52, 85, 155)' : 'gray', cursor: 'pointer', borderRadius: '10px'
                        }}>{symbole}</div>
                ))}
            </div>
            {Array.isArray(numbers) &&
                <div style={{
                    display: 'flex', flexDirection: 'row', gap: 10,
                    backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center'
                }}>
                    <p style={styles.numbers}>{numbers[selectedNumbers[0]]}</p>
                    <p style={styles.symbole}>{selectedSymbole}</p>
                    <p style={styles.numbers}>{numbers[selectedNumbers[1]]}</p>
                    {calc()}
                </div>
            }
        </div>

    )
}
