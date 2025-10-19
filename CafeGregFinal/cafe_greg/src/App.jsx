import ErrorPage from './Pages/ErrorPage.jsx'
import { Route, Routes, useNavigate } from 'react-router-dom'
import LoginWebsite from './Pages/WebsiteLogin.jsx'
import WorkMain from './Pages/WorkMain.jsx'
import SideChoice from './Pages/SideChoice.jsx'
import ToggleService from './Pages/ToggleService.jsx'
import CafeMain from './Pages/CafeMain.jsx'
import Menu from './Pages/Menu.jsx'
import ProductPage from './Pages/ProductPage.jsx'
import CustomerRegisterLogin from './Pages/CustomerRegisterLogin.jsx'
import CustomersHistory from './Pages/CustomersHistory.jsx'
import KitchenBarPreparation from './Pages/KitchenBarPreparation.jsx'

function App() {

  const navigate = useNavigate()

  const goto = (path, states) => {
    navigate(path, { relative: true, state: states });
  }

  const [profilName, setProfilName] = useState(null)

  const login = (login, password) => {
    const profilFound = 'CafeGreg'
    if (profilFound) {
      console.log('connect with login');
      setProfilName(profilFound)

    }
    else {
      console.log('dont connect with login');
    }

  }

  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<ErrorPage goto={goto} />}></Route>
          <Route path='/login' element={<LoginWebsite goto={goto} login={login}/>}></Route>
          <Route path='/sideChoice' element={<SideChoice goto={goto} />}></Route>
          <Route path='/workMain' element={<WorkMain goto={goto} />}></Route>
          <Route path='/toggleService' element={<ToggleService goto={goto} />}></Route>
          <Route path='/cafeMain' element={<CafeMain goto={goto} />}></Route>
          <Route path='/menu' element={<Menu goto={goto} />}></Route>
          <Route path='/productPage' element={<ProductPage goto={goto} />}></Route>
          <Route path='/customerRegisterLogin' element={<CustomerRegisterLogin goto={goto} />}></Route>
          <Route path='/customerHistory' element={<CustomersHistory goto={goto} />}></Route>
          <Route path='/kitchenBarPreparation' element={<KitchenBarPreparation goto={goto} />}></Route>
          <Route path='/manager' element={<ManagerPage goto={goto} />}></Route>
          <Route path='/manager/workers' element={<ManagerWorkerPage goto={goto} />}></Route>
          <Route path='/manager/products' element={<ManagerProductPage goto={goto} />}></Route>
          <Route path='/manager/stats' element={<ManagerStats goto={goto} />}></Route>
          <Route path='/manager/sendMessageToTables' element={<ManagerSendMessageToTables goto={goto} />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App



import { io } from "socket.io-client";
import ManagerPage from './Pages/ManagerPage.jsx'
import ManagerWorkerPage from './Pages/ManagerWorkerPage.jsx'
import ManagerProductPage from './Pages/ManagerProductPage.jsx'
import ManagerStats from './Pages/ManagerStats.jsx'
import ManagerSendMessageToTables from './Pages/ManagerSendMessageToTables.jsx'
import { useState } from 'react'
export const socket = io("http://localhost:5500");