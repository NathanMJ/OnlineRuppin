import { useEffect, useState } from 'react'
import FCLoginCustomerSide from '../FComponents/FCLoginCustomerSide.jsx';
import FCRegisterCustomerSide from '../FComponents/FCRegisterCustomerSide.jsx';
import FCHeaderCustomers from '../FComponents/FCHeaderCustomers.jsx';
import ReturnButton from '../FComponents/ReturnButton.jsx';
import { useLocation } from 'react-router-dom';

export default function CustomerRegisterLogin(props) {

  const location = useLocation()
  const { tableId } = location.state

  const [customersDB, setCustomersDB] = useState([{ name: 'Nathan', id: '345538268', contact: '0584020406' }])

  // const [customers, setCustomers] = useState(location.state?.customers ?? [])


  const [customers, setCustomers] = useState([{ name: 'Nathan', id: '345538268', contact: '0584020406' },
  { name: 'John', id: '345538267', contact: '0584020406' },
  { name: 'Mick', id: '345538269', contact: '0584020406' },
  { name: 'Jordan', id: '345538270', contact: '0584020406' },
  { name: 'Sarah', id: '345538271', contact: '0584020406' },
  { name: 'Johnathan', id: '345538272', contact: '0584020406' },
  { name: 'Jojo', id: '345538273', contact: '0584020406' },
  { name: 'Frank', id: '345538274', contact: '0584020406' }
  ])

  const correctID = (id) => {
    let regexIsID = /^[0-9]{8,9}$/;
    return regexIsID.test(id)
  }

  const isPhone = (contact) => {
    let regexIsPhone = /^0[0-9]{9}$/;
    return regexIsPhone.test(contact)
  }

  const isEmail = (contact) => {
    let regexIsEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexIsEmail.test(contact)
  }

  const login = async (id) => {
    if (!id) {
      alert('ID is missing')
    }
    //check id
    if (!correctID(id)) {
      alert('The id is not valid')
      return
    }

    //check if the customer is already logged in
    let customerLogged = customers.find(customer => customer.id === id)
    if (customerLogged) {
      alert('You are already logged in')
      return
    }

    //check if id is in the database
    let customer = customersDB.find(customer => customer.id === id)
    if (!customer) {
      alert('ID not found')
      return
    }

    //send a message to the customer to confirm it's him

    //temp message
    if (isPhone(customer.contact)) {
      alert('A message will be sent to your phone number to confirm')
    }
    else if (isEmail(customer.contact)) {
      alert('A message will be sent to your email to confirm')
    }
    else {
      alert('Contact is not valid')
      return
    }
    if (confirm('Is it you ?')) {
      alert('You have been logged in')
      //add the customer to the customers list
      let newCustomers = [...customers, customer]
      setCustomers(newCustomers)
    } else {
      alert('Timeout')
    }
  }

  const register = async (name, id, contact) => {
    if (!name || !id || !contact) {
      alert('One field is missing')
    }

    //check id

    if (!correctID(id)) {
      alert('The id is not valid')
      return
    }

    //check if contact is email or phone

    let regexIsEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let regexIsPhone = /^0[0-9]{9}$/;

    if (!regexIsEmail.test(contact) && !regexIsPhone.test(contact)) {
      alert('Contact must be a valid email or phone number')
      return
    }

    //check if id is already in the database
    let customer = customersDB.find(customer => customer.id === id)
    if (customer) {
      alert('ID already in the database')
      return
    }

    //check if contact is already logged in
    let customerLogged = customers.find(customer => customer.contact === contact)
    if (customerLogged) {
      alert('Contact already logged in')
      return
    }

    //here the id and contact are valid

    //send a message if it is a phone number
    if (regexIsPhone.test(contact)) {
      alert('A message will be sent to your phone number to confirm')
    }
    //send a message if it is an email
    if (regexIsEmail.test(contact)) {
      alert('A message will be sent to your email to confirm')
    }

    //here you click on "it's me" and confirm it's you

    //temp message

    if (confirm('Is it you ?')) {
      //send the id and contact to the server

      alert('You have been registered')
      let newCustomers = [...customers, { name, id, contact }]
      setCustomers(newCustomers)

      let newCustomersDB = [...customersDB, { name, id, contact }]
      setCustomersDB(newCustomersDB)
    }
    else {
      alert('Timeout')
    }

  }

  const logOut = async (id) => {
    if (confirm('Are you sure you want to log out ?')) {
      let newCustomers = customers.filter(customer => customer.id !== id)
      setCustomers(newCustomers)
      alert('You have been logged out')
    }
  }

  useEffect(() => {
    console.log('customers', customers);
  }, [customers])

  const clickOnReturnBtn = () => {

    props.goto('/menu', { tableId })
  }
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }} className='customerRegisterLoginPage'>
        <FCHeaderCustomers logOut={logOut} goto={props.goto} customers={customers} ></FCHeaderCustomers>
        <FCRegisterCustomerSide register={register} ></FCRegisterCustomerSide>
        <FCLoginCustomerSide login={login}></FCLoginCustomerSide>
        <ReturnButton returnButton={clickOnReturnBtn} bottom={'20px'} left={'20px'} ></ReturnButton>

      </div>
    </>
  )
}
