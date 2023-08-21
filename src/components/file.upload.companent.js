import React, { Component } from "react";
import FileService from "../services/file.service";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

class UploadFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: "",
            selectedFile: null,
            result: ""
        };
    }

    handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const allowedExtensions = ['.jpg', '.png', '.jpeg', '.docx', '.pdf', '.xlsx'];
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

            if (!allowedExtensions.includes(`.${fileExtension}`)) {
                this.setState({ error: 'The file type is invalid. Valid types (png, jpeg, jpg, docx, pdf, xlsx) Maximum Size 5Mb' });
            } else if (selectedFile.size > maxSizeInBytes) {
                this.setState({ error: 'Maximum Size 5Mb' });
            } else {
                this.setState({ error: '' });
                this.setState({ selectedFile });
            }
        }
    };

    uploadFile = () => {
        const { selectedFile } = this.state;

        if (selectedFile) {
            FileService.upload(selectedFile).then(response => {
                console.log(response);

                this.setState({
                    error: "",
                    result: "The file has been uploaded successfully."
                });
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
                    content: response.data,
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
                }
            }
        );
    }

    render() {
        const { error, result } = this.state;
        return (
            <div className="container">
                <header className="jumbotron">
                    {error !== "401" ? (
                        <div>
                            <h2>File Upload Page</h2>
                            <input
                                type="file"
                                onChange={this.handleFileChange}
                            />
                            <button onClick={this.uploadFile}>Upload File</button>
                        </div>
                    ) : (
                        <p>Unauthorized Access</p>
                    )}

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

export default UploadFile;
