import { Route, Routes, useNavigate } from 'react-router-dom'
import ErrorPage from './Pages/ErrorPage.jsx'
import { useEffect, useState } from 'react'
import { useMessageContext } from './Contexts/messageContext.jsx'
import { io } from "socket.io-client";
import { getToken } from './connectToDB.js'
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
import ManagerPage from './Pages/ManagerPage.jsx'
import ManagerWorkerPage from './Pages/ManagerWorkerPage.jsx'
import ManagerProductPage from './Pages/ManagerProductPage.jsx'
import ManagerStats from './Pages/ManagerStats.jsx'
import ManagerSendMessageToTables from './Pages/ManagerSendMessageToTables.jsx'


export const socket = io("http://localhost:5500");

function App() {

  const localStorageName = 'profil-ez-dinner'
  const navigate = useNavigate()
  const { addMessage } = useMessageContext();


  const goto = (path, states) => {
    navigate(path, { relative: true, state: states });
  }

  const thisPathNeedProfile = (path) => {
    const accessPaths = ['/', '/login']
    return !accessPaths.some(p => p == path);
  }

  const [profile, setProfile] = useState(null)

  //if you try to connect directly you go to login if you are not correctly connected
  useEffect(() => {
    const checkProfile = async () => {
      const currentPath = location.pathname;

      //if we dont have a profil check if we are in a page where we need a profile

      //if we dont need of profil and we got a profile
      if (!thisPathNeedProfile(currentPath)) {
        if (profile) {
          setProfile(null)
        }
        localStorage.removeItem(localStorageName)
        return
      }


      if (profile)
        return

      //check in the localStorage if you dont have a profile and check the token

      let tempProfile = JSON.parse(localStorage.getItem(localStorageName))
      console.log(`profile got from localStorage`, tempProfile);

      //if no profile found go to login

      if (!tempProfile) {
        goto('/login')
        return
      }

      //check the token gotten from the localStorage

      const rightToken = await getToken(tempProfile.profile, tempProfile.token)
      if (!rightToken.ok) {
        addMessage('Wrong token detected.', 'warning', 5000)
        setProfile(null)
        goto('/login')
        return
      }

      setProfile(tempProfile)

    }

    checkProfile()


  }, [location.pathname])


  useEffect(() => {
    setEmit()

    return () => {
      cancelEmit()
    }
  }, [profile?.profile])


  const cancelEmit = () => {
    if (profile) {
      console.log('cancel emit for profile', profile);
      socket.off('profile:check-token', checkToken);
      socket.emit('unsubscribe:profile', profile.profile);
    }
  }

  const setEmit = () => {
    if (profile) {
      console.log('set emit for profile', profile);
      socket.on('profile:check-token', checkToken);
      socket.emit('subscribe:profile', profile.profile);
    }
  }



  const checkToken = (data) => {
    //set the check token research
    console.log(data);
    
  }




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

