export default function MainPage(props) {
  return (
    <div className="mainPage">
      <div>
        <img className='logo' src="../src/Pictures/Logos/logo.png" alt="logo" />
        <h1 onClick={() => { props.goto('loginRegisterPage') }}>Touch here to continu</h1>
      </div>
    </div>
  )

}
