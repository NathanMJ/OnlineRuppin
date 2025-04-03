import React, { useState } from 'react'

export default function AddSubOrder(props) {
  const [img, setImg] = useState(props.status == '+' ? 
    'https://e7.pngegg.com/pngimages/474/275/png-clipart-computer-icons-plus-and-minus-signs-plus-sign-scalable-graphics-positive-logo-cross.png'
     : props.status == '-' ? 'https://i.pinimg.com/474x/6a/0a/21/6a0a2140369f6fc926ef6683b873a65d.jpg'
      : null)
    return (
    <div className='addSubIngredient'>
        <img src={img} alt={img}/>
        <p>{props.ingredient}</p>
    </div>
  )
}
