import "./App.css";
import Navigation from "./components/navigation/navigation";
import Logo from "./components/logo/logo";
import Rank from "./components/rank/rank";
import ImageLinkForm from "./components/image-link-form/image-link-form";
import FaceRecognition from "./components/face-recognition/face-recognition";


const particlesOptions = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5,
      },
    },
  },
}

function App() {
  return (
    <div className="App">
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      <FaceRecognition />
    </div>
  );
}

export default App;
