import "./App.css";
import Navigation from "./components/navigation/navigation";
import Logo from "./components/logo/logo";
import Rank from "./components/rank/rank";
import ImageLinkForm from "./components/image-link-form/image-link-form";
import FaceRecognition from "./components/face-recognition/face-recognition";
import { Component } from "react";
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: "93b146b761a14505bd801949ee49fa8f",
});
class App extends Component {
  state = { input: "", imageUrl: "", box: {} };

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };

    // console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
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
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((err) => console.log(err));
  };
  render() {
    const { imageUrl } = this.state;
    return (
      <div className="App">
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={imageUrl} />
      </div>
    );
  }
}

export default App;
