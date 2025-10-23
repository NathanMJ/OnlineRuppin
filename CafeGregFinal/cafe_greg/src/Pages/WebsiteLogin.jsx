import { useEffect, useState } from "react"
import { useMessageContext } from "../Contexts/messageContext";
import { connectToWebsite, setToken } from "../connectToDB";


export default function WebsiteLogin(props) {
    const [counter, setCounter] = useState(0)
    const [id, setId] = useState("CafeGreg")
    const [password, setPassword] = useState("123")
    const { addMessage } = useMessageContext();

    const tokenLength = 16

    const generateRandomString = (length) => {
        // Caractères possibles : chiffres (0-9) et lettres (a-z, A-Z)
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            // Choisir un caractère aléatoire
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }

    const generateToken = () => {
        const fullToken = generateRandomString(tokenLength);
        //separation of 4
        let token = ""
        for (let i = 0; i * 4 < tokenLength; i++) {
            if (i != 0) {
                token += '-'
            }
            token += fullToken.substring((i * 4), ((i + 1) * 4))
        }
        return token
    }


    const clickOnLogin = async () => {
        //connect return the profile
        const token = generateToken()
        const res = await connectToWebsite(id, password, token)
        if (!res.ok) {
            addMessage(res.message, 'error', 5000)
            return
        }
        const profileFound = res.profile
        localStorage.setItem(props.localStorageName, JSON.stringify({ profile: profileFound, token }))      
        props.goto('/sideChoice')
    }




    useEffect(() => {
        if (counter > 5) {
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
                    value={id}
                    onChange={(e) => setId(e.target.value)} />
                <h4>Password : </h4>
                <input type="password"
                    className="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="loginButton"
                onClick={clickOnLogin}>Login</button>
            {counter > 0 && <div className="answer">Error {counter} false try</div>}
        </div>
    )
}
