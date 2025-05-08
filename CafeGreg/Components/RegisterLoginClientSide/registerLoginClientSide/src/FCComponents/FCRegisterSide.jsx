import React, { useEffect, useState } from 'react'

export default function FCRegisterSide(props) {
    
  const [regField, setRegField] = useState(-1)

  const [contact, setContact] = useState('nathanmimoun2001@gmail.com')

  const changeRegField = (event, boolean) => {
    event.preventDefault()
    setRegField(boolean)
  }
  
  return (
    <div className="Register">
        <h1>Register</h1>
        <form style={{ display: 'flex', flexDirection: 'column' }}onSubmit={(e) => {
                e.preventDefault()
                if(regField == -1){
                    alert('Please select email or phone')
                    return
                }
                props.register(e.target[0].value, contact);
            }}>
          <div style={{ display: 'flex' }}>
            <h2>Your id :</h2>
            <input type="text" placeholder='Tehoudat zehout' defaultValue={'345538268'}/>
          </div>
          <div style={{ display: 'flex' }}>
            <div className="buttons">
              <button style={{ backgroundColor: regField === 0 ? 'blue' : 'rgb(48, 47, 47)' }} onClick={(e) => changeRegField(e, 0)}>
                <h2>Email</h2>
              </button>
              <button style={{ backgroundColor: regField === 1 ? 'blue' :'rgb(48, 47, 47)'  }} onClick={(e) => changeRegField(e, 1)}>
                <h2>Phone</h2>
              </button>
            </div>
          </div>
          {regField === -1 ?
          <div>
            <h2>Please select email or phone</h2>
          </div> :
            regField === 0 ?
            <div style={{ display: 'flex' }}>
              <h2>Enter your email</h2>
              <input type="text" defaultValue={'nathanmimoun2001@gmail.com'} onChange={(e) => {setContact(e.target.value)}}/>
            </div> :
            <div style={{ display: 'flex' }}>
              <h2>Enter your phone number</h2>
              <input type="text"  defaultValue={'0584020406'} onChange={(e) => {setContact(e.target.value)}}/>
            </div>}
            <button type='submit'><h2>Register</h2></button>
        </form>
      </div>
  )
}
