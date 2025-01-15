import { useState } from "react"
import { Link, useNavigate} from "react-router-dom"

export default function Home() {
    const navigate = useNavigate()
    const [users, setUsers] = useState("hello")

  const addUser = () =>{
    let newUsers = [...users, user]
    console.log(`user ${user} added`);    
    setUsers(newUsers)
  }
    return (
        <div>
            <div>
                <Link to={'/login'}>Login</Link> <br/>
              <Link to={{pathname:'/register',state:{users}}}>
              Register
              </Link></div>
            <h1>Home page</h1>
        </div>
    )
}
