export default function FCSection(props) {

    const clickOnSection = () => {
        //change the sectionId in the parent component
        props.setSectionId(props.section._id);
    }

    return (
        <div className='sections' 
        style={{ backgroundImage: `url(${props.section.img})`}} onClick={clickOnSection}>
            <h1>{props.section.name}</h1>
        </div>
    )
}
