import React from 'react'

export default function RegisterSide() {
    return (
        <div className='registerSide'>
            <img src="./src/Pictures/Logos/register.png" alt="register-logo" />
            <input type="text" maxLength={12} placeholder='PokeName' />
            <input type="text" maxLength={12} placeholder='PokeEmail'/>
            <input type="password" maxLength={12} placeholder='PokePassword'/>
            <p className='errorMessage'>One of the fields is not correct</p>
            <button className='registerButton'>Start the adventure !</button>
        </div>
    )
}
