import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import MainPage from './Pages/MainPage'
import LoginRegisterPage from './Pages/LoginRegisterPage'
import PokeTransition from "./FuncComps/PokeTransition.jsx";
import { useEffect, useState } from 'react';


function App() {
  const [rendTransition, setRendTransition] = useState(false)
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {

    switch (location.pathname) {
      case '/':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/menu.jpg')"
        console.log('main back');
        break;
      case '/loginRegisterPage':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/forest.jpg')"
        console.log('main back');
        break;
    }
    console.log('changed the background');

  }, [location])

  const transition = (activation) => {
    console.log(activation ? 'activate' : 'deactivate');
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
      </Routes>



      <div id='links' style={{ display: 'flex',backgroundColor:'white', fontSize:'30px',gap: '10px', position:'fixed',bottom:0,left:0}}>
        <Link to="/">MainPage</Link>
        <button onClick={() => goToWithTransition('/loginRegisterPage')}>Go to loginRegister with animation</button>
      </div>
      <style>
        
      </style>
    </>
  )
}

export default App
