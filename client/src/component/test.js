import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";

const Test = () => {
  // const navigate = useNavigate();
  // const changeToSiam = () => {
  //   navigate("/siam");
  // };
  
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path=""
            element={
              <div>
                <h1>hello</h1>
                <Link to ='/siam'> Siam </Link>
                <br/>
                <Link to ='/alif'> Alif </Link>
              </div>
            }
          />
          <Route
            path="/siam"
            element={
              <div>
                <h1>hello siam</h1>
                <Link to ='/alif'> Alif </Link>
                <br/>
                <Link to ='/'> Home </Link>
              </div>
            }
          />
          <Route
            path="/alif"
            element={
              <div>
                <h1>hello alif</h1>
                <Link to ='/siam'> Siam </Link>
                <br/>
                <Link to ='/'> Home </Link>
              </div>
            }
          />
        </Routes>

        {/* <button className="btn btn-success"> */}
        {/* </button> */}
      </div>
    </Router>
  );
}

export default Test;