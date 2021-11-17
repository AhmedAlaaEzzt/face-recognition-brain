const Navigation = ({ onRouteChange, isSignedIn, onSignOut }) => {
  let reunderButtons=(<div>Empty</div>);
  if (isSignedIn) {
    reunderButtons = (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          onClick={onSignOut}
          className="f3 link dim black underline pa3 pointer"
        >
          Sign Out
        </p>
      </nav>
    );
  } else {
    reunderButtons = (
      <>
        <nav style={{ display: "flex", justifyContent: "flex-end" }}>
          <p
            onClick={() => onRouteChange("signin")}
            className="f3 link dim black underline pa3 pointer"
          >
            Sign In
          </p>
          <p
            onClick={() => onRouteChange("register")}
            className="f3 link dim black underline pa3 pointer"
          >
            Register
          </p>
        </nav>
      </>
    );
  }

  return (<>{ reunderButtons }</>);
};

export default Navigation;
