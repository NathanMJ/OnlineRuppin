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

  const localStorageName = 'profil-ez-dinner'
  const navigate = useNavigate()
  const { addMessage } = useMessageContext();


  const goto = (path, states) => {
    navigate(path, { relative: true, state: states });
  }

  const [profile, setProfile] = useState(null)

  //if you try to connect directly you go to login if you are not correctly connected
  useEffect(() => {
    const checkProfile = async () => {
      const accessPaths = ['/', '/login']
      const currentPath = location.pathname;
      const isPathWithProfil = !accessPaths.some(p => p == currentPath);
      if (!isPathWithProfil) {
        localStorage.removeItem(localStorageName)
      }
      else {
        let tempProfile = JSON.parse(localStorage.getItem(localStorageName))
        if (!tempProfile) {
          goto('/login')
        }
        //if the tempProfile does not correspond to an existing token go to login too
        const rightToken = await getToken(tempProfile.profile, tempProfile.token)
        if (!rightToken.ok) {
          addMessage('Wrong token detected.', 'warning', 5000)
          goto('/login')
        }
        setProfile(tempProfile)
      }
    }

    checkProfile()
  }, [location.pathname])



  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<ErrorPage goto={goto} />}></Route>
          <Route path='/login' element={<LoginWebsite goto={goto} localStorageName={localStorageName} />}></Route>
          <Route path='/sideChoice' element={<SideChoice goto={goto} profile={profile} />}></Route>
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
import { useEffect, useState } from 'react'
import { connectToWebsite, getToken } from './connectToDB.js'
import { useMessageContext } from './Contexts/messageContext.jsx'
export const socket = io("http://localhost:5500");