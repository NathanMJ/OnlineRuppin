import React from 'react'

export default function LoginSide() {
    return (
        <div className='loginSide'>
            <img src="./src/Pictures/Logos/login.png" alt="login-logo" />
            <input type="text" maxLength={12} placeholder='PokeEmail'/>
            <input type="password" maxLength={12} placeholder='PokePassword'/>
            <p className='errorMessage'>One of the fields is not correct</p>
            <button className='loginButton'>Continu the adventure !</button>
        </div>
    )
}
