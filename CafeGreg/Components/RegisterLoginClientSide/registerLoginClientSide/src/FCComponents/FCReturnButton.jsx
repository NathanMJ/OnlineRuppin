import React from 'react'

export default function FCReturnButton(props) {

    const returnPage = () => {
        alert('Return to the previous page')
    }

  return (
    <div 
      onClick={returnPage} 
      style={{
        backgroundColor: 'red',
        color: 'white',
        position: 'fixed',
        left: props.left ? props.left : undefined,
        right: props.right ? props.right : undefined,
        top: props.top ? props.top : undefined,
        bottom: props.bottom ? props.bottom : undefined,
        fontSize: props.size ? props.size : '5vh',
        borderRadius : '5px',
        padding: '5px',
        border: '5px solid white',
        cursor: 'pointer', 
      }}
    >
      Return
    </div>
  )
}
