import './App.css'
import FCRegisterSide from './FCComponents/FCRegisterSide.jsx'
import FCLoginSide from './FCComponents/FCLoginSide.jsx'

function App() {

const correctID = (id) => {  
    let regexIsID = /^[0-9]{8,9}$/;
    return regexIsID.test(id)
}

  const login = (id) => {    
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

  const register = (id, contact) => {
    if(!id || !contact) {
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



    console.log('Register', id, contact);
    
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <FCRegisterSide register={register} ></FCRegisterSide>
        <FCLoginSide login={login}></FCLoginSide>
      </div>
    </>
  )
}

export default App
