import "./App.css";
import Navigation from "./components/navigation/navigation";
import Logo from "./components/logo/logo";
import Rank from "./components/rank/rank";
import ImageLinkForm from "./components/image-link-form/image-link-form";
import FaceRecognition from "./components/face-recognition/face-recognition";
import { Component } from "react";
import Clarifai from "clarifai";
import SignIn from "./components/sign-in/sign-in";
import Register from "./components/register/register";

const app = new Clarifai.App({
  apiKey: "93b146b761a14505bd801949ee49fa8f",
});
class App extends Component {
  static initialState = ()=> ({
    input: "",
    imageUrl: "",
    boxs: [],
    route: "sigin",
    isSignedIn: false,
    user: {
      id: "",
      name: "",
      email: "",
      entries: 0,
      joined: "",
    },
  }
  )
  state = App.initialState();

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.join,
      },
    });
  };

  onRouteChange = (route) => {
    switch (route) {
      case "signin":
        this.setState({ isSignedIn: false });
        break;
      case "home":
        this.setState({ isSignedIn: true });
        break;
      default:
    }
    this.setState({ route: route });
  };
  calculateFaceLocations = (data) => {
    const clarifaiFaceRegions = data.outputs[0].data.regions;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return clarifaiFaceRegions.map((region) => {
      const bounding_box = region.region_info.bounding_box;
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
      .then((response) =>{
        this.displayFaceBoxs(this.calculateFaceLocations(response))
        /**call image method to update image counter in the database */
        fetch(`https://cryptic-river-90110.herokuapp.com/image/${this.state.user.id}` ,{
          method:'put',
          headers: {'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .then(userEntries => {
            this.setState(prevState =>({user: Object.assign(prevState.user,{entries: userEntries})}))
          })
      })
      .catch((err) => console.log(err));
  };

  onSignOut=()=>{
    this.onRouteChange("signin");
    this.setState(App.initialState())
  }

  render() {
    const { imageUrl, route, isSignedIn } = this.state;

    const page = () => {
      switch (route) {
        case "home":
          return (
            <>
              <Logo />
              <Rank user={this.state.user}/>
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxs={this.state.boxs} imageUrl={imageUrl} />
            </>
          );
        case "register":
          return <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />;
        case "sigin":
        default:
          return (
            <SignIn
              onSignIn={this.onSignIn}
              isSignedIn={isSignedIn}
              onRouteChange={this.onRouteChange}
              loadUser={this.loadUser}
            />
          );
      }
    };

    return (
      <div className="App">
        <Navigation
          onSignOut={this.onSignOut}
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {page()}
      </div>
    );
  }
}

export default App;
