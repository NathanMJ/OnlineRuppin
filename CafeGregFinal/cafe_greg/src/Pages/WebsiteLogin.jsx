import { useEffect, useState } from "react"
import { connectToWebsite } from "../connectToDB"


export default function WebsiteLogin(props) {
    const [counter, setCounter] = useState(0)
    const [id, setId] = useState("")
    const [password, setPassword] = useState("")


    const clickOnLogin = async () => {
        const res = await connectToWebsite(id, password)
        console.log(res);

        if (res) {
            props.goto('/sideChoice')
        } else {
            console.log("Erreur de connexion");
            setCounter(prevS => prevS + 1)
        }
    }

    useEffect(() => {
        console.log(id, password);
    }, [id, password])

    useEffect(() => {
        if(counter > 5){
            {
                props.goto('/websiteBlocked')
            }
        }
    }, [counter])

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
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="loginButton"
                onClick={clickOnLogin}>Login</button>
            {counter > 0 && <div className="answer">Error {counter} false try</div>}
        </div>
    )
}
