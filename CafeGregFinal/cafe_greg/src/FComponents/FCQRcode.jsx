export default function FCQRcode(props) {

    const tempQRcode = 'https://images.seeklogo.com/logo-png/21/1/qr-code-logo-png_seeklogo-217342.png'

    if(!props.show){
        return
    }

    return (
        <div className='FCQRcode'>
            <h1>Scan me on the link App !</h1>
            <img className="qrCode" src={tempQRcode} />
            <img className="cross" src='../Pictures/Cross.png' onClick={props.hide}/>
        </div>)
}
