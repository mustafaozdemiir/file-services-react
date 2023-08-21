import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Table } from "reactstrap";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    return (
      <div className=" card-container">
        <h3 style={{ textAlign: "center" }}>Profile</h3>
        {(this.state.userReady) ?
          <div>
            <header className="jumbotron">
              <h3 style={{ textAlign: "center" }}>
                <strong>{currentUser.username}</strong>
              </h3>
            </header>

            <Table hover>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>  {currentUser.accessToken.substring(0, 20)} ...{" "}
                    {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}</th>
                </tr>
                <tr>
                  <th>Id</th>
                  <th>{currentUser.id}</th>
                </tr>
                <tr>
                  <th>E-mail</th>
                  <th>{currentUser.email}</th>
                </tr>
              </thead>

            </Table>

          </div> : null}
      </div>
    );
  }
}
