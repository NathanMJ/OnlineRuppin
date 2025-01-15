import { useState } from "react"

export default function Login() {
    
    const [name, setName] = useState()
    const clickOnLogin = () => {
        alert(name)
    }
    
    return (
        <div><h1>Login page</h1>
        <div>Name : <input type="text"/></div>
        <div>Email : <input type="text"/></div>
        <button onClick={clickOnLogin}>Login</button></div>
    )
}
