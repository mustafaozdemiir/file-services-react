import React, { Component } from "react";

import FileService from "../services/file.service";
import EventBus from "../common/EventBus";
import { withRouter } from "../common/with-router";
import { Table } from "reactstrap";




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
          <div className='row text-center'>
            <Table hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>File Name</th>
                  <th>Replace</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {
                  this.state.files.map((file) => (
                    <tr key={file.id}>
                      <td>{file.id}</td>
                      <td>{file.name}</td>
                      <td><button style={{ marginLeft: "10px", fontWeight: "bold" }} onClick={() => this.replaceFile(file.id)} className='btn btn-success'>Replace</button></td>
                      <td><button onClick={() => this.deleteFile(file.id)} className='btn btn-danger'>Delete</button></td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
            <h3>{this.state.error === "" ? " " : this.state.error} </h3>
            <h3>{this.state.result}</h3>
          </div>
        </header>
      </div>
    );
  }
}

export default withRouter(FileList);