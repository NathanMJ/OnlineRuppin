import { useEffect, useState } from 'react'
import FCLoginCustomerSide from '../FComponents/FCLoginCustomerSide.jsx';
import FCRegisterCustomerSide from '../FComponents/FCRegisterCustomerSide.jsx';
import FCHeaderCustomers from '../FComponents/FCHeaderCustomers.jsx';
import ReturnButton from '../FComponents/ReturnButton.jsx';
import { useLocation } from 'react-router-dom';
import { getCustomersFromTable, loginCustomerToTable, logOutCustomerFromATable, registerCustomerToTable } from '../connectToDB.js';

export default function CustomerRegisterLogin(props) {

  const location = useLocation()
  const { tableId } = location.state


  const [customers, setCustomers] = useState([])

  useEffect(() => {
    console.log(customers);
  }, [customers])
    
  const fetchCustomers = async () => {
    //fetch the customers from the server
    getCustomersFromTable(tableId).then(data => {
      if (data && Array.isArray(data)) {
        setCustomers(data)
      } else {
        setCustomers([])
      }
    })
  }

  useEffect(() => {
    fetchCustomers()
  }, [tableId])

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
      return
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

    const res = await loginCustomerToTable(tableId, id).then(response => {
      if (response.status === 200) {
        fetchCustomers()
      }
    })
  }

  const register = async (name, id, contact) => {
    if (!name || !id || !contact) {
      alert('One field is missing')
      return
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

    const res = await registerCustomerToTable(tableId, name, id, contact).then(response => {
      if (response.status === 200) {
        fetchCustomers()
        //TODO: empty the form
      }
    })


  }

  const logOut = async (id) => {
    if (confirm('Are you sure you want to log out ?')) {
      logOutCustomerFromATable(id).then(response => {
        fetchCustomers()
      }
      )
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
        <FCHeaderCustomers logOut={logOut} goto={props.goto} customers={customers} tableId={tableId}></FCHeaderCustomers>
        <FCRegisterCustomerSide register={register} ></FCRegisterCustomerSide>
        <FCLoginCustomerSide login={login}></FCLoginCustomerSide>
        <ReturnButton returnButton={clickOnReturnBtn} bottom={'20px'} left={'20px'} ></ReturnButton>

      </div>
    </>
  )
}
