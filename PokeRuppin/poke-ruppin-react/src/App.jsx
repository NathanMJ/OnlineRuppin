import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import MainPage from './Pages/MainPage'
import LoginRegisterPage from './Pages/LoginRegisterPage'
import PokeTransition from "./FuncComps/PokeTransition.jsx";
import { useEffect, useState } from 'react';
import RegisterPage from './Pages/RegisterPage.jsx';
import MenuPage from './Pages/MenuPage.jsx';
import GetPokeRuppins from './Pages/GetPokeRuppins.jsx';
import MyRuppinDex from './Pages/MyRuppinDex.jsx';
import FullScreenBtn from './FuncComps/FullScreenBtn.jsx';


function App() {
  const [rendTransition, setRendTransition] = useState(false)
  const navigate = useNavigate();
  const location = useLocation()
  const [pokeUsers, setPokeUsers] = useState(localStorage.getItem('pokeUsers') ? JSON.parse(localStorage.getItem('pokeUsers')) : [])


  useEffect(() => {
    localStorage.setItem('pokeUsers', JSON.stringify(pokeUsers))
  }, [pokeUsers])

  const addUser = (newUser) => {
    console.log('add : ', newUser.name);
    if (pokeUsers) {
      setPokeUsers([...pokeUsers, newUser])
    }
    else {
      setPokeUsers[newUser]
    }
    localStorage.setItem('pokeUsers', JSON.stringify(pokeUsers))
  }

  const canLogin = (name, password) => {
    return pokeUsers.some(eachUser =>
      name === eachUser.name && password === eachUser.password
    );
  };

  const buyCredits = (name, addCredit) => {
    const currentUserIndex = pokeUsers.findIndex(eachPokeUser => eachPokeUser.name == name);

    const updatedUser = {
      ...pokeUsers[currentUserIndex],
      credits: pokeUsers[currentUserIndex].credits + addCredit
    };

    const updatedPokeUsers = [...pokeUsers];
    updatedPokeUsers[currentUserIndex] = updatedUser;

    //update users
    setPokeUsers(updatedPokeUsers);
  };

  const getUser = (name) => {
    let tempPokeUser;
    tempPokeUser = pokeUsers.find(eachPokeUser => eachPokeUser.name == name)
    return tempPokeUser
  }

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
      case 'myRuppinDex':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/coast.jpg')"
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

  const useCredits = (name, quantity) => {
    const currentUserIndex = pokeUsers.findIndex(eachPokeUser => eachPokeUser.name == name);

    const updatedUser = {
      ...pokeUsers[currentUserIndex],
      credits: pokeUsers[currentUserIndex].credits - quantity
    };

    const updatedPokeUsers = [...pokeUsers];
    updatedPokeUsers[currentUserIndex] = updatedUser;

    //update users
    setPokeUsers(updatedPokeUsers);
  };

  return (
    <>

      <FullScreenBtn></FullScreenBtn>

      <PokeTransition transition={transition} rendTransition={rendTransition}></PokeTransition>


      <Routes>
        <Route path="/" element={<MainPage goto={goToWithTransition} />} />
        <Route path="/loginRegisterPage" element={<LoginRegisterPage goto={goToWithTransition} canLogin={canLogin} pokeUsers={pokeUsers}/>} />
        <Route path="/registerPage/:name/:email/:password" element={<RegisterPage addUser={addUser} goto={goToWithTransition}/>} />
        <Route path="/menuPage/:name" element={<MenuPage goto={goToWithTransition} getUser={getUser} useCredits={useCredits} />} />
        <Route path="/getPokeRuppins/:name" element={<GetPokeRuppins goto={goToWithTransition} />} />
        <Route path="/myRuppinDex/:name" element={<MyRuppinDex goto={goToWithTransition} />} />
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
