// import './Styles/reset.css'
// import './Styles/PokeTransition.css' 
import { Link, Route, Routes } from 'react-router-dom'
import MainPage from './Pages/MainPage'
import LoginRegisterPage from './Pages/LoginRegisterPage'
import PokeTransition from "./FuncComps/PokeTransition.jsx";
import { act, useEffect, useState } from 'react';


function App() {
  const [rendTransition, setRendTransition] = useState(false)



  const transition = (activation) =>{
    console.log(activation?'activate':'deactivate');
    setRendTransition(activation)
  }

  return (
    <>
      <PokeTransition transition={transition} rendTransition={rendTransition}></PokeTransition>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/loginRegisterPage" element={<LoginRegisterPage />} />
      </Routes>
      

      <button onClick={() => transition(true)}>Active the transition</button>
     
      <div id='links' style={{display:'flex',gap:'10px'}}>
        <Link to="/">MainPage</Link>
        <Link to="/loginRegisterPage">Login/Register</Link>
      </div>
    </>
  )
}

export default App
