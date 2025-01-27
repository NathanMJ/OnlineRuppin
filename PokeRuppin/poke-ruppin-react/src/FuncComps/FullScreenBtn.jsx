export default function FullScreenBtn() {

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen(); // Entrer en mode plein écran
        } else {
          document.exitFullscreen(); // Quitter le mode plein écran
        }
      };        
    return (
    <img onClick={toggleFullscreen} className="fullscreenBtn" src="../src/Pictures/Logos/fullscreen.png" alt="fullscreenLogo" />
    )
}
