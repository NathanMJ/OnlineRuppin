import { useNavigate } from "react-router-dom";

export default function ReturnButton(props) {
  const navigate = useNavigate();

  // soit la fonction passée en props, soit un fallback
  const handleClick = props.returnButton || (() => navigate(-1));

  return (
    <div
      style={{
        position: props.position || 'absolute',
        ...(props.top !== undefined && { top: props.top }),
        ...(props.bottom !== undefined && { bottom: props.bottom }),
        ...(props.left !== undefined && { left: props.left }),
        ...(props.right !== undefined && { right: props.right }),
        backgroundColor: 'white',
        color: 'black',
        fontSize: '60px',
        padding: '1vh',
        borderRadius: '20px',
        border: '5px solid black',
        cursor: 'pointer',
        zIndex: '10'
      }}
      onClick={handleClick}
    >
      Return
    </div>
  );
}
