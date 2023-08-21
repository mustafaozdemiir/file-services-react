import React, { Component } from "react";
import FileService from "../services/file.service";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { withRouter } from "../common/with-router";


class ReplaceFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: "",
            result: "",
            id: props.router.params.id,
            selectedFile: null
        };
    }


    handleFileChange = (event) => {
        this.setState({
            selectedFile: event.target.files[0],
            if(selectedFile) {
                const allowedExtensions = ['.jpg', '.png', '.jpeg', '.docx', '.pdf', '.xlsx'];
                const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
                const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

                if (!allowedExtensions.includes(`.${fileExtension}`)) {
                    this.setState({ error: 'The file type is invalid. Valid types (png, jpeg, jpg, docx, pdf, xlsx)' });
                } else if (selectedFile.size > maxSizeInBytes) {
                    this.setState({ error: 'Maximum Size 5Mb' });
                } else {
                    this.setState({ error: '' });
                    this.setState({ selectedFile });
                }
            }
        });

    }

    replaceFile = () => {
        const { selectedFile } = this.state;

        if (selectedFile) {
            console.log(this.state.id + " <-")
            FileService.replace(this.state.id, selectedFile).then(response => {

                this.setState({
                    error: "",
                    result: "File Updated"
                });
                this.props.router.navigate("/");

            }).catch(error => {
                this.setState({
                    error: (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
                if (error.response && error.response.status === 400) {
                    this.setState({
                        error: "The file type is invalid. Valid types (png, jpeg, jpg, docx, pdf, xlsx) Maximum Size 5Mb"
                    });
                } else if (error.response && error.response.status === 401) {
                    this.setState({
                        error: "401"
                    });
                    EventBus.dispatch("logout");
                }
            });
        } else {
            this.setState({
                error: "Please select a file."
            });
        }
    }


    componentDidMount() {
        UserService.getUserBoard().then(
            response => {
                this.setState({
                    content: response.data
                });

            },
            error => {
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
                        error: "401"
                    });
                    EventBus.dispatch("logout");
                } else if (error.response.status === 404) {
                    this.setState({
                        result: "File not found."
                    });
                }
            }
        );
    }

    render() {
        const { error, result } = this.state;

        return (
            <div className="card container" style={{ textAlign: "center" }} >
                <h2>File Replacement Page</h2>
                <header className="jumbotron">
                    {error !== "401" ? <div>
                        <input
                            type="file"
                            onChange={this.handleFileChange}
                        />
                        <br />
                        <br />
                        <br />
                        <button className='btn btn-success' onClick={this.replaceFile}>Replace File</button></div> : <p>Unauthorized Access</p>}

                    <p>
                        {error !== "401" ?
                            (error === "Network Error"
                                ? 'The file type is invalid. Valid types (png, jpeg, jpg, docx, pdf, xlsx) Maximum Size 5Mb'
                                : '')
                            : ''}
                    </p>
                    <p>{result}</p>

                </header>
            </div>
        );
    }
}
export default withRouter(ReplaceFile);