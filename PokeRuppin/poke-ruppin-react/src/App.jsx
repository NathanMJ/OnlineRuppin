import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import MainPage from './Pages/MainPage'
import LoginRegisterPage from './Pages/LoginRegisterPage'
import PokeTransition from "./FuncComps/PokeTransition.jsx";
import { useEffect, useState } from 'react';
import RegisterPage from './Pages/RegisterPage.jsx';
import MenuPage from './Pages/MenuPage.jsx';
import GetPokeRuppins from './Pages/GetPokeRuppins.jsx';


function App() {
  const [rendTransition, setRendTransition] = useState(false)
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {

    //set the background according to the pathname
    switch (location.pathname.split('/')[1]) {
      case '':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/menu.jpg')"
        break;
      case 'loginRegisterPage':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/forest.jpg')"
        break;
      case 'registerPage':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/glacier.jpg')"
        break;
      case 'menuPage':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/volcano.jpg')"
        break;
      case 'getPokeRuppins':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/cave.jpg')"
        break;
    }
  }, [location.pathname])

  const transition = (activation) => {
    setRendTransition(activation)
    //animation is 1500 ms
  }

  const goToWithTransition = (link) => {
    transition('true')
    setTimeout(() => {
      navigate(link)
    }, 750)
  }


  return (
    <>
      <PokeTransition transition={transition} rendTransition={rendTransition}></PokeTransition>


      <Routes>
        <Route path="/" element={<MainPage goto={goToWithTransition} />} />
        <Route path="/loginRegisterPage" element={<LoginRegisterPage goto={goToWithTransition} />} />
        <Route path="/registerPage/:name/:email/:password" element={<RegisterPage goto={goToWithTransition} />} />
        <Route path="/menuPage/:name" element={<MenuPage goto={goToWithTransition} />} />
        <Route path="/getPokeRuppins/:name" element={<GetPokeRuppins goto={goToWithTransition} />} />
      </Routes>



      <div id='links' style={{ display: 'flex', backgroundColor: 'white', fontSize: '30px', gap: '10px', position: 'fixed', bottom: 0, left: 0 }}>
        <Link to="/">MainPage</Link>
        <Link to="/loginRegisterPage">LoginRegister</Link>
      </div>
      <style>

      </style>
    </>
  )
}

export default App
