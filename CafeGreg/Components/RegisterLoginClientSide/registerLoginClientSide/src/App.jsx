import './App.css'
import FCRegisterSide from './FCComponents/FCRegisterSide.jsx'
import FCLoginSide from './FCComponents/FCLoginSide.jsx'
import { useEffect, useState } from 'react'
import HeaderCustomers from './FCComponents/HeaderCustomers.jsx'

function App() {

const [customers, setCustomers] = useState([{name: 'Nathan', id: '345538268', contact: '0584020406'},
  {name: 'Nathan', id: '345538268', contact: '0584020406'},
  {name: 'Nathan', id: '345538268', contact: '0584020406'},
  {name: 'Nathan', id: '345538268', contact: '0584020406'},
  {name: 'Nathan', id: '345538268', contact: '0584020406'},
  {name: 'Nathan', id: '345538268', contact: '0584020406'},
  {name: 'Nathan', id: '345538268', contact: '0584020406'},
  {name: 'Nathan', id: '345538268', contact: '0584020406'},
  {name: 'Nathan', id: '345538268', contact: '0584020406'}])

const correctID = (id) => {  
    let regexIsID = /^[0-9]{8,9}$/;
    return regexIsID.test(id)
}

  const login = async (id) => {    
    if(!id) {
      alert('ID is missing') 
    }
    //check id
    if(!correctID(id)) {
      alert('The id is not valid')
      return
    }
    console.log('Login', id);    
  }

  const register = async (name, id, contact) => {
    if(!name || !id || !contact) {
      alert('One field is missing') 
    }

    //check id

    let regexIsID = /^[0-9]{8,9}$/;
    if(!correctID(id)) {
      alert('The id is not valid')
      return
    }

    //check if contact is email or phone
    
    let regexIsEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let regexIsPhone = /^0[0-9]{9}$/;

    if(!regexIsEmail.test(contact) && !regexIsPhone.test(contact)) {
      alert('Contact must be a valid email or phone number')
      return
    }


    //here the id and contact are valid

    //send a message if it is a phone number
    if(regexIsPhone.test(contact)) {
      alert('A message will be sent to your phone number to confirm')
    }
    //send a message if it is an email
    if(regexIsEmail.test(contact)) {
      alert('A message will be sent to your email to confirm')
    }

    //here you click on "it's me" and confirm it's you

    //temp message

    let res = confirm(id, contact)
    if(res){
      //send the id and contact to the server
      
      alert('You have been registered')
      let newCustomers = [ ...customers, {id, contact}]
      setCustomers(newCustomers)
    }
    
  }

  useEffect(() => {
    console.log('customers', customers);
    
  }, [customers])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
      <HeaderCustomers customers={customers} ></HeaderCustomers>
        <FCRegisterSide register={register} ></FCRegisterSide>
        <FCLoginSide login={login}></FCLoginSide>
      </div>
    </>
  )
}

export default App
