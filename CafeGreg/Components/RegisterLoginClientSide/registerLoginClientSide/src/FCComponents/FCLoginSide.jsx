import React from 'react'

export default function FCLoginSide(props) {

    return (
        <div className="Login">
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
                props.login(e.target[0].value, e.target[1].value)
            }}
                style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex' }}>
                    <h2>Your id :</h2>
                    <input type="text" placeholder='Tehoudat zehout' defaultValue={'345538268'} />
                </div>
                <div style={{ display: 'flex' }}>
                    <h2>Confirm your id :</h2>
                    <input type="text" placeholder='Tehoudat zehout' defaultValue={'345538268'} />
                </div>
                <button type='submit'><h2>Login</h2></button>
            </form>
        </div>
    )
}
