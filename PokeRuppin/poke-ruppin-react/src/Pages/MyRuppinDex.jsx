import { useParams } from "react-router-dom";
import ReturnMenuBtn from "../FuncComps/ReturnMenuBtn";

export default function MyRuppinDex(props) {

  const params = useParams()

  const myCards = props.getPokeRuppins(params.name)
  
  const regularCards = myCards.filter(pokeCard => !pokeCard.name.includes('gold'))
  console.log(regularCards);

  const goldCards = myCards.filter(pokeCard => pokeCard.name.includes('gold'))

  //en mode moi j'ai que la quantity de pokemon en tout

  //en mode en tout j'ai la quantity/total normal et nombre gold

  let keyCard = 0;
  return (
    <div className="myRuppinDexPage">
      <header className="myCollection">
        <h1>My collection</h1>
        <div className="normalCards">
          <h1>Regular cards :{regularCards.length}/20</h1>
        </div>
        <div>Golds cards :{goldCards.length}/3</div>
      </header>
      <div className="myCards">
      {(regularCards.length + goldCards.length) == 0 ? <><div></div> <h1>Empty</h1> </>: (
<>
    {regularCards.map((eachCard) => (
      <div key={`${eachCard.name}`} className="cardContainer">
        <img className="card" src={`../src/Pictures/PokeCards/${eachCard.name}.png`} alt="card" />
        <h1 className="countCard">{eachCard.quantity}</h1>
      </div>
    ))}

    {goldCards.map((eachCard) => (
      <div key={`${eachCard.name}`} className="cardContainer">
        <img className="card" src={`../src/Pictures/PokeCards/${eachCard.name}.png`} alt="card" />
        <h1 className="countCard">{eachCard.quantity}</h1>
      </div>
    ))}
  </>
)}

        
      </div>
      <ReturnMenuBtn goto={props.goto} name={params.name}></ReturnMenuBtn>
    </div>
  )
}
