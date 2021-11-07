import "./App.css";
import Navigation from "./components/navigation/navigation";
import Logo from "./components/logo/logo";
import Rank from "./components/rank/rank";
import ImageLinkForm from "./components/image-link-form/image-link-form";
import FaceRecognition from "./components/face-recognition/face-recognition";
import { Component } from "react";
import Clarifai from "clarifai";
import SignIn from "./components/sign-in/sign-in";

const app = new Clarifai.App({
  apiKey: "93b146b761a14505bd801949ee49fa8f",
});
class App extends Component {
  state = { input: "", imageUrl: "", boxs: [] };

  calculateFaceLocations = (data) => {
    const clarifaiFaceRegions = data.outputs[0].data.regions;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return clarifaiFaceRegions.map((region) => {
      const bounding_box = region.region_info.bounding_box
      return {
        leftCol: bounding_box.left_col * width,
        topRow: bounding_box.top_row * height,
        rightCol: width - bounding_box.right_col * width,
        bottomRow: height - bounding_box.bottom_row * height,
      };
    });

  };

  displayFaceBoxs = (boxs) => {
    this.setState({ boxs: boxs });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    /*
      model name = Clarifai.FACE_DETECT_MODEL
      model id = a403429f2ddf4b49b307e318f00e528b
    */
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBoxs(this.calculateFaceLocations(response))
      )
      .catch((err) => console.log(err));
  };
  render() {
    const { imageUrl } = this.state;
    return (
      <div className="App">
        <Navigation />
        <SignIn/>
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition boxs={this.state.boxs} imageUrl={imageUrl} />
      </div>
    );
  }
}

export default App;
