import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Register(props) {
    
    const [name, setName] = useState()
    const navigate = useNavigate()
    const [password, setPassword] = useState()
    const {state } = useLocation()
    console.log(state)

    const clickOnRegister = () => {
        if(!name || !password){
            console.log('ERROR')
            return
        }
        console.log(`Register successully`)
        const newUser = {
            name:name,
            password:password
        }

        navigate('/login', {state: {users,newUser}})


    }
    
    return (
        <div><h1>Register page</h1>
        <div>Name : <input type="text" onChange={(e)=>setName(e.target.value)}/></div>
        <div>Password : <input type="text" onChange={(e)=>setPassword(e.target.value)}/></div>
        <button onClick={clickOnRegister}>Login</button></div>
    )
}
