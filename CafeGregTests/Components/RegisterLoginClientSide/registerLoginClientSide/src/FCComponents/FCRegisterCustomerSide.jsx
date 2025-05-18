import React, { useState } from 'react'

export default function FCRegisterSide(props) {

  const [regField, setRegField] = useState(-1)

  const [contact, setContact] = useState('nathanmimoun2001@gmail.com')

  const changeRegField = (event, boolean) => {
    event.preventDefault()
    setRegField(boolean)
  }

  const register = (e) => {
    e.preventDefault()
    if (regField == -1) {
      alert('Please select email or phone')
      return
    }
    props.register(e.target[0].value, e.target[1].value, contact);
  }

  return (
    <div className="FCRegisterCustomerSide" >
      <h1>Register</h1>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={(e) => register(e)}>
        <div className="labelInputDiv">
          <h2>Your name :</h2>
          <input type="text" placeholder='Name' defaultValue={'Nathan'} />
        </div>
        <div className="labelInputDiv">
          <h2>Your tehoudat zehout :</h2>
          <input type="text" placeholder='Tehoudat zehout' defaultValue={'345538268'}/>
        </div>
        <div style={{ display: 'flex' }}>
          <div className="buttons" style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
            <button style={{ backgroundColor: regField === 0 ? 'blue' : 'rgb(48, 47, 47)' }} onClick={(e) => changeRegField(e, 0)}>
              <h2>Email</h2>
            </button>
            <button style={{ backgroundColor: regField === 1 ? 'blue' : 'rgb(48, 47, 47)' }} onClick={(e) => changeRegField(e, 1)}>
              <h2>Phone</h2>
            </button>
          </div>
        </div>
        {regField === -1 ?
          <div>
            <h2>Please select email or phone</h2>
          </div> :
            <div  className="labelInputDiv" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
              <h2>Enter your {(regField === 0 ? "email" : "phone number")}</h2>
              <input type="text" defaultValue={'nathanmimoun2001@gmail.com'} onChange={(e) => { setContact(e.target.value) }} style={{width:'80%', textAlign:'center'}}/>
            </div>
            }
        <button type='submit'>Register</button>
      </form>
    </div>
  )
}
