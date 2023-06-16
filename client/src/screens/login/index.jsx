import React, { useState } from "react";
import "./login.css";
import Book from "../../components/book";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [active, setActive] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const handleSignIn = async (data) => {
    
    let baseUrl;
    if (data === "login") {
      baseUrl = "http://localhost:5000/api/login";
    } else if (data === "signup") {
      baseUrl = "http://localhost:5000/api/signup";
    }
    let req = {
      email: email,
      password: password,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    };
    let res = await fetch(baseUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    if (res.token) {
      localStorage.setItem("userAuth", res.token);
      navigate('/home')
    }
  };
  return (
    <div className="backGroundDiv">
      <div className="flex mainContainer">
        {/* <div className="overlaySlide"></div> */}
        <div className="relative">
          <div
            style={
              active === "signup"
                ? { opacity: 0 }
                : { opacity: "100%", transition: ".4s ease-in" }
            }
            className="height100"
          >
            <h1>LOGIN</h1>
            {/* <div>
              <button>GOOGLE</button>
              <button>FACEBOOK</button>
            </div> */}
            <div>
              <input
                placeholder="enter your email"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              <br />
              <input
                placeholder="enter yout password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
              <br />
              <button
                onClick={() => handleSignIn("login")}
                className="formbutton"
              >
                LOGIN
              </button>
            </div>
          </div>
          <div
            className={"absoluteText"}
            style={
              active === "signup"
                ? { transform: "translate(0%,0%)", top: 0, left: 0 }
                : { transform: "translate(100%,0%)" }
            }
          >
            <h1>IF you have an account you can </h1>
            <button onClick={() => setActive("login")}>LOGIN</button>
            <Book />
          </div>
        </div>
        <div className="relative">
          <div
            style={
              active === "login"
                ? { opacity: 0 }
                : { opacity: "100%", transition: ".4s ease-in" }
            }
            className="height100"
          >
            <h1>SIGNUP</h1>
            {/* <div>
              <button>GOOGLE</button>
              <button>FACEBOOK</button>
            </div> */}
            <div>
              <input
                placeholder="enter a email"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              <br />

              <input
                placeholder="create a password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
              <br />

              <button
                onClick={() => handleSignIn("signup")}
                className="formbutton"
              >
                SIGNUP
              </button>
            </div>
          </div>
          <div
            className="absoluteText"
            style={
              active === "login"
                ? { transform: "translate(0%,0%)", top: 0, left: 0 }
                : { transform: "translate(-100%,0%)" }
            }
          >
            <h1>If you don't have an account you can </h1>
            <button onClick={() => setActive("signup")}>SIGNUP</button>
            <Book />
          </div>
        </div>
      </div>
    </div>
  );
}
