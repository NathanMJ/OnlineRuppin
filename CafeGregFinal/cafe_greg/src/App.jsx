import ErrorPage from './Pages/ErrorPage.jsx'
import { Route, Routes, useNavigate } from 'react-router-dom'
import LoginWebsite from './Pages/WebsiteLogin.jsx'
import WorkMain from './Pages/WorkMain.jsx'
import SideChoice from './Pages/SideChoice.jsx'
import ToggleService from './Pages/ToggleService.jsx'
import CafeMain from './Pages/CafeMain.jsx'
import Menu from './Pages/Menu.jsx'
import ProductPage from './Pages/ProductPage.jsx'

function App() {

      const navigate = useNavigate()

      const goto = (path, states) => {
        navigate(path, { state: states });
      }

  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<ErrorPage goto={goto}/>}></Route>
          <Route path='/login' element={<LoginWebsite goto={goto}/>}></Route>
          <Route path='/sideChoice' element={<SideChoice goto={goto}/>}></Route>
          <Route path='/workMain' element={<WorkMain goto={goto}/>}></Route>
          <Route path='/toggleService' element={<ToggleService goto={goto}/>}></Route>
          <Route path='/cafeMain' element={<CafeMain goto={goto}/>}></Route>
          <Route path='/menu' element={<Menu goto={goto}/>}></Route>
          <Route path='/productPage' element={<ProductPage goto={goto}/>}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
