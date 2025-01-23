import { useParams } from "react-router-dom"

export default function RegisterPage() {
  const params = useParams()

  console.log(params);
  
  return (
    <div>RegisterPage</div>
  )
}
