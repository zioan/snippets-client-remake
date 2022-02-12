import axios from "axios";
import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import UserContext from "../../context/UserContext";
import domain from "../../util/domain";
import "./Navbar.scss";

function Navbar() {
  const { user, getUser } = useContext(UserContext);
  const [username, setUserName] = useState("");

  const history = useHistory();
  const location = useLocation();

  async function logOut() {
    await axios.get(`${domain}/auth/logOut`);
    await getUser();
    history.push("./");
  }

  async function getUserName() {
    const userName = await axios.get(`${domain}/auth/userName`);
    await getUser();
    setUserName(userName.data);
  }

  //must add useEffect here !
  getUserName();

  return (
    <div className="navbar">
      <Link to="/">
        <h1>Snippet manager</h1>
      </Link>
      <div>
        {user && (
          <>
            <p className="user">Welcome {username}</p>

            {location.pathname === "/" && (
              <button
                className="btn-logout"
                onClick={() => history.push("./snippets")}
              >
                Snippets
              </button>
            )}

            <button className="btn-logout" onClick={logOut}>
              Log out
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
