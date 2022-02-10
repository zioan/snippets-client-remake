import axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import domain from "../../util/domain";
import ErrorMessage from "../misc/ErrorMessage";
import "./AuthForm.scss";

function Register() {
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formPasswordVerify, setFormPasswordVerify] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const { getUser } = useContext(UserContext);
  const history = useHistory();

  async function register(e) {
    e.preventDefault();

    const registerData = {
      email: formEmail,
      password: formPassword,
      passwordVerify: formPasswordVerify,
    };

    try {
      await axios.post(`${domain}/auth/`, registerData);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          setErrorMessage(err.response.data.errorMessage);
        }
      }
      return;
    }

    await getUser();
    history.push("/snippets");
  }

  return (
    <div className="auth-form">
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          clear={() => setErrorMessage(null)}
        />
      )}

      <div className="form-container">
        <div className="divider">
          <p>
            <span className="action">Register</span>
          </p>
        </div>
        <form className="form" onSubmit={register}>
          <label htmlFor="form-email">Email</label>
          <input
            id="form-email"
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
          />
          <label htmlFor="form-password">Password</label>
          <input
            id="form-password"
            type="password"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
          />
          <label htmlFor="form-passwordVerify">Confirm password</label>
          <input
            id="form-passwordVerify"
            type="password"
            value={formPasswordVerify}
            onChange={(e) => setFormPasswordVerify(e.target.value)}
          />

          <button className="btn-submit" type="submit">
            Register
          </button>
        </form>
      </div>
      <div className="form-footer">
        <p>
          By signing up, you agree to our
          <span> Terms </span> and
          <span> Cookies Policy</span>.
        </p>
      </div>
    </div>
  );
}

export default Register;
