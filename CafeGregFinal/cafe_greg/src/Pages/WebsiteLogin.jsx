import { useEffect, useState } from "react"


export default function WebsiteLogin(props) {
    const [counter, setCounter] = useState(0)
    const [id, setId] = useState("")
    const [password, setPassword] = useState("")


    const clickOnLogin = () => {
        props.goto('/sideChoice')
    }

    useEffect(() => {
        console.log(id, password);
    }, [id, password])

    return (
        <div className='loginWebsite'>
            <h1>Login</h1>
            <div>
                <h4>Id : </h4>
                <input 
                type="text" 
                className="id" 
                placeholder="Identifiant" 
                onChange={(e) => setId(e.target.value)} />
                <h4>Password : </h4>
                <input type="password" 
                className="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} /></div>
            <button id="loginButton"
            onClick={clickOnLogin}>Login</button>
            <div id="answer"></div>
        </div>
    )
}
