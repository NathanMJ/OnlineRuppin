import { useParams } from "react-router-dom";
import ReturnMenuBtn from "../FuncComps/ReturnMenuBtn";

export default function MyRuppinDex(props) {

  const params = useParams()

  return (
    <div className="myRuppinDexPage">MyRuppinDex
      <ReturnMenuBtn goto={props.goto} name={params.name}></ReturnMenuBtn>
    </div>
  )
}
