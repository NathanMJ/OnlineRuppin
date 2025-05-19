import ErrorPage from './Pages/ErrorPage.jsx'
import { Route, Routes, useNavigate } from 'react-router-dom'
import LoginWebsite from './Pages/WebsiteLogin.jsx'
import WorkMain from './Pages/WorkMain.jsx'
import SideChoice from './Pages/SideChoice.jsx'
import ToggleService from './Pages/ToggleService.jsx'

function App() {

      const navigate = useNavigate()

      const goto = (path) => {
        navigate(path)
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
        </Routes>
      </div>
    </>
  )
}

export default App
