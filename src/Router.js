import React from "react";
import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/misc/Navbar";
import Snippets from "./components/home/Snippets";
import HomePage from "./components/home/HomePage";

function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/snippets">
          <Snippets />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
