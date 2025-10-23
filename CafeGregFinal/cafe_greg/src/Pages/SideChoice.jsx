import ReturnButton from "../FComponents/ReturnButton"

export default function SideChoice(props) {

    const storeAccess = props.storeAccess

    console.log('profile gotten in side choice',storeAccess);
    
    
    const returnButton = () => {
        if(confirm("Are you sure you want to return?")) {
            props.goto('/login')
        }
    }



    return (
        
        <div className="sideChoice">
            <div onClick={()=>props.goto('cafeMain')} className="cafeSide"><h2>Cafe Side</h2></div>
            <div onClick={()=>props.goto('workMain')} className="workSide"><h2>Work Side</h2></div>
            <ReturnButton bottom={'3vh'} left={'3vh'} returnButton={returnButton}></ReturnButton>
        </div>
    )
}
