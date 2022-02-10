import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Login from "../auth/Login";
import Register from "../auth/Register";
import UserContext from "../../context/UserContext";
import axios from "axios";
import domain from "../../util/domain";
import "./HomePage.scss";
import codeImg from "../../assets/code10.png";

function HomePage() {
  const [login, setLogIn] = useState(true);

  const { getUser } = useContext(UserContext);

  const history = useHistory();

  async function domoLogin() {
    const loginData = {
      email: "JohnDoe@gmail.com",
      password: "password121212",
    };

    try {
      await axios.post(`${domain}/auth/login/`, loginData);
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      }
      return;
    }

    await getUser();
    history.push("/snippets");
  }

  return (
    <>
      <div className="home-page">
        <div>
          <p className="description">
            <span>Snippets Manager</span> is a web application that allows
            managing and securely storing your coding snippets.
          </p>
          <img className="code-img" src={codeImg} alt="code img" />
          <p className="demo-content">We have prepared a demo account.</p>
          <p className="demo-content">
            Click <button onClick={domoLogin}>Log in</button> to try Snippets
            Manager now!
          </p>
        </div>

        <div className="form-layout">
          {login ? <Login /> : <Register />}
          {login ? (
            <p className="form-action">
              Don't have an accout yet?{" "}
              <button onClick={() => setLogIn(!login)}>Register here</button>
            </p>
          ) : (
            <p className="form-action">
              {" "}
              Already have an account?{" "}
              <button onClick={() => setLogIn(!login)}>Login instead</button>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
