import React, { Fragment, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

// setAuth is props which triggers the authentication if user was valid
const Login = ({ setAuth }) => {
  
  // getting login data from user and storing them into these variable
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  // destructuring of login variable
  const { name, email, password } = inputs;
  const navigate = useNavigate();
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // onSubmit function for login button if clicked
  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const body = { name, email, password };
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // does this notification type ui
      if (response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Unauthorized! Please check your credentials!!!",
        });
        return;
      } else {
        Swal.fire({
          icon: "success",
          title: "Congrats...",
          text: "Login successful...",
        });
      }

      // storing jwt token during login if valid
      const parseRes = await response.json();
      localStorage.setItem("token", parseRes.token);
      setAuth(true);
      navigate("/userhome");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center my-5">Login</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="name"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => onChange(e)}
          className="form-control my-3"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onChange(e)}
          className="form-control my-3"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onChange(e)}
          className="form-control my-3"
        />
        <button className="btn btn-success btn-block">Submit</button>
      </form>
      <Link to="auth/register">Register</Link>
    </Fragment>
  );
};

export default Login;
