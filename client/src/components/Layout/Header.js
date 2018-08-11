import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./layout.css";

class Header extends Component {

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {

    const { isAuthenticated } = this.props.auth;

    return (
      <div className="header">
        <Link to="/"><h1>SYNTHONIUM</h1></Link>
        {
          !isAuthenticated()
          ? <ul className="nav">
              <li onClick={this.login.bind(this)}>Sign Up/Login</li>
            </ul>
          : <ul className="nav">
              <Link to="/create"><li>Create Post</li></Link>
              <li onClick={this.logout.bind(this)}>Logout</li>
            </ul>
        }
      </div>
    );
  }
}

export default Header;