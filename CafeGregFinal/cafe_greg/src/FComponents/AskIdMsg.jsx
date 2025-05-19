import { useState } from "react";

export default function AskIdMsg(props) {
    const [id, setId] = useState("");
    const [animation, setAnimation] = useState(false);

    const confirm = async () => {
        //check if the id is valid
    
        const isValid = await props.sendId(1123)


        if(isValid){
            //return the id to the parent component
            //if the id is valid, call the function to hide the message
            props.goToWithId(id)
            //if the id is not valide, call the function "wrongId"
            props.hideMsg()
        }
        else {
            wrongId()
        }
    }

    const cancel = () => {
        //close the message 
        props.hideMsg()

    }

    const wrongId = () => {
        //shake the message
        setAnimation(true);
        setTimeout(() => {
            setAnimation(false);
        }, 1000);
    }

    if (!props.show) {
        return
    }

    return (
        <div className={'askIdMessage' + (animation ? " shake" : "")}>
            <h2 className="title">Insert your id</h2>
            <div className="inputContainer">
                <img src="../Pictures/Id-logo.png" className="logo" />
                <input type="text" placeholder="Your id" maxLength="9" />
                <img 
                onClick={confirm}
                src="../Pictures/Confirmation.png" 
                className="validation" />
            </div>
            <img
                src="../Pictures/Cross.png"
                className="cancel"
                onClick={cancel} />
            <div className="backgroundAskIdMessage"></div>
        </div>
    )
}
