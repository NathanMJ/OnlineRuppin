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
import GetCredits from './Pages/GetCredits.jsx';


function App() {
  const [rendTransition, setRendTransition] = useState(false)
  const navigate = useNavigate();
  const location = useLocation()
  const [pokeUsers, setPokeUsers] = useState(localStorage.getItem('pokeUsers') ? JSON.parse(localStorage.getItem('pokeUsers')) : [])

  const everyPokeRuppins = ['giorakazam',
    'habib-gold',
    'nir-gold',
    'nir',
    'sasha',
    'sasha-gold',
    'shay-gold',
    'shay',
    'tami-gold',
    'tami',
    'yael-gold'
  ]

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

  const addPokeRuppins = (name, pokeRuppinName, quantity) => {
    // Trouver l'utilisateur
    const currentUserIndex = pokeUsers.findIndex(eachPokeUser => eachPokeUser.name === name);

    if (currentUserIndex === -1) {
      console.error(`Utilisateur ${name} non trouvé`);
      return;
    }

    const currentUser = pokeUsers[currentUserIndex];
    const currentPokeRuppins = currentUser.pokeRuppins || []; // S'assurer qu'on a un tableau

    // Check if exist / find the index
    const currentPokeRuppinIndex = currentPokeRuppins.findIndex(eachPokeRuppin => eachPokeRuppin.name === pokeRuppinName);

    let updatedPokeRuppins;

    if (currentPokeRuppinIndex !== -1) {
      // If exist add quantity
      updatedPokeRuppins = currentPokeRuppins.map((eachPokeRuppin, index) =>
        index === currentPokeRuppinIndex
          ? { ...eachPokeRuppin, quantity: eachPokeRuppin.quantity + quantity }
          : eachPokeRuppin
      );
    } else {
      // If not exist set the quantity
      updatedPokeRuppins = [...currentPokeRuppins, { name: pokeRuppinName, quantity }];
    }

    const updatedUser = { ...currentUser, pokeRuppins: updatedPokeRuppins };

    const updatedPokeUsers = [...pokeUsers];
    updatedPokeUsers[currentUserIndex] = updatedUser;

    setPokeUsers(updatedPokeUsers);
  };



  const buyCredits = (name, addCredit) => {
    console.log('buy', addCredit);
    
    const creditsBoughts = addCredit * (-1)
    useCredits(name, creditsBoughts)
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
      case 'getPokeRuppins':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/cave.jpg')"
        break;
      case 'myRuppinDex':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/coast.jpg')"
        break;
      case 'getCredits':
        document.body.style.backgroundImage = "url('/src/Pictures/Background/volcano.jpg')"
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

  const getPokeRuppins = (name) => {
    const currentUser = pokeUsers.find(eachPokeUser => eachPokeUser.name === name);
    return currentUser.pokeRuppins || [];
  };


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
        <Route path="/loginRegisterPage" element={<LoginRegisterPage goto={goToWithTransition} canLogin={canLogin} pokeUsers={pokeUsers} />} />
        <Route path="/registerPage/:name/:email/:password" element={<RegisterPage addUser={addUser} goto={goToWithTransition} />} />
        <Route path="/menuPage/:name" element={<MenuPage goto={goToWithTransition} getUser={getUser} useCredits={useCredits} />} />
        <Route path="/getPokeRuppins/:name" element={<GetPokeRuppins goto={goToWithTransition} addPokeRuppins={addPokeRuppins} everyPokeRuppins={everyPokeRuppins}/>} />
        <Route path="/myRuppinDex/:name" element={<MyRuppinDex goto={goToWithTransition} getPokeRuppins={getPokeRuppins} />} />
        <Route path="/getCredits/:name" element={<GetCredits goto={goToWithTransition} getUser={getUser} buyCredits={buyCredits} />} />

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
