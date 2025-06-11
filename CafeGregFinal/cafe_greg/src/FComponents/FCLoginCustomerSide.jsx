import React from 'react'

export default function FCLoginCustomerSide(props) {

    return (
        <div className="FCLoginCustomerSide">
            <h1>Login</h1>
            <form onSubmit={(e) => {
                e.preventDefault()
                if(e.target[0].value === '' || e.target[1].value === '') {
                    alert('Please fill in all fields')
                    return
                }
                if(e.target[0].value.length !== 9) {
                    alert('ID must be 9 digits long')
                    return
                }
                if(e.target[0].value !== e.target[1].value) {
                    alert('IDs do not match')
                    return
                }
                console.log(e.target[0].value);                
                props.login(e.target[0].value)
            }}>
                <div className="labelInputDiv">
                    <h2>Your id :</h2>
                    <input type="text" placeholder='Tehoudat zehout' />
                </div>
                <div className="labelInputDiv">
                    <h2>Confirm your id :</h2>
                    <input type="text" placeholder='Tehoudat zehout'/>
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}
