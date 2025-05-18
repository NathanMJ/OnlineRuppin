
export default function ErrorPage(props) {
    const goToLogin = () => {
        props.goto('/login')
    }
    return (
        <div className="notFoundPage">
            <h1>404</h1>
            <h2>Oops... page not found</h2>
            <h3>We don't know how you end up here, but you should go away now.</h3>
            <div className="hiddenDoor" onClick={goToLogin}></div>
        </div>
    )
}
