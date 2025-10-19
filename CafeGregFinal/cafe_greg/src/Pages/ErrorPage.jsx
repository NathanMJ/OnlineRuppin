
export default function ErrorPage(props) {
    const goToLogin = () => {
        props.goto('/login')
    }

    
    return (
        <div className="notFoundPage">
            <h1>404</h1>
            <h2>Oops... page not found</h2>
            <h3>The page you're looking for doesn't exist or has been moved</h3>
            <div className="hiddenDoor" onClick={goToLogin}></div>
        </div>
    )
}
