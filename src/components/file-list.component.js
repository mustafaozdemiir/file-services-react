import React, { Component } from "react";

import FileService from "../services/file.service";
import EventBus from "../common/EventBus";
import { withRouter } from "../common/with-router";




class FileList extends Component {
  constructor(props) {
    super(props);
    console.log("-- ", props)
    this.state = {
      content: "",
      files: [],
      error: "",
      result: ""

    };
  }

  componentDidMount() {
    FileService.getAll().then(response => {

      this.setState({
        files: response.data,
        error: "",
      });

    }, error => {
      this.setState({
        content:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
      });

      if (error.response && error.response.status === 401) {
        this.setState({
          error: "Unauthorized Access"


        });
        EventBus.dispatch("logout");
      }
    }
    );

  }


  deleteFile(fileId) {
    FileService.delete(fileId).then(response => {
      console.log(response)

      this.setState({
        result: "Deletion successful",
        error: ""
      });
      window.location.reload();
    }, error => {
      this.setState({
        content:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
      });

      if (error.response && error.response.status === 401) {
        this.setState({
          error: "Unauthorized Access"

        });
        EventBus.dispatch("logout");
      }
    }
    );
  }

  replaceFile(fileId) {
    this.props.router.navigate("/replace/" + fileId);
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          {this.state.files.map((file, index) => (
            <div key={index}>
              <h3 key={index}>{index + 1 + " - " + file.name}</h3>
              <button onClick={() => this.replaceFile(file.id)}>Replace</button>
              <button onClick={() => this.deleteFile(file.id)}>Delete</button>
            </div>

          ))}
          <h3>{this.state.error === "" ? " " : this.state.error} </h3>
          <h3>{this.state.result}</h3>
        </header>
      </div>
    );
  }
}

export default withRouter(FileList);