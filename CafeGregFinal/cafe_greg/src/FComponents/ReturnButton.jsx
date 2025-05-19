export default function ReturnButton(props) {

  return (
    <div style={{
      position: 'fixed',
      ...(props.top !== undefined && { top: props.top }),
      ...(props.bottom !== undefined && { bottom: props.bottom }),
      ...(props.left !== undefined && { left: props.left }),
      ...(props.right !== undefined && { right: props.right }),
      backgroundColor:'white',
      color: 'black',
      fontSize: '7vh',
      padding: '1vh',
      borderRadius: '20px',
      border: '5px solid black',
      cursor: 'pointer'
    }}
    onClick={props.returnButton}>
      Return
    </div>
  )
}
