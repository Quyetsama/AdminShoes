import React, { Component } from "react";
import { connect } from "react-redux";
import "./ModalOrder.scss";
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from "../../../../utils";
import { FormattedMessage } from "react-intl";
import * as actions from "../../../../store/actions";
import { Modal } from "reactstrap";
import { createNewProject } from "../../../../services/userService";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt();

class ModalOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            note: "",
            imageBase64: "",
            descriptionHTML: "",
            descriptionMarkdown: "",
        };
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState) {}

    handleOnChangeInput = (event, id) => {
        const copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    };

    handleOnchangeImage = async (event) => {
        const data = event.target.files;
        console.log("Data: ", data);
        const file = data[0];
        console.log("File: ", file);
        if (file) {
            const base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    };

    checkValidateInput = () => {
        let isValid = true;
        const arrCheck = [
            "name",
            "note",
            "imageBase64",
            "descriptionHTML",
            "descriptionMarkdown",
        ];

        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                toast.error("Missing input: " + arrCheck[i]);
                break;
            }
        }

        return isValid;
    };

    handleSaveProject = async () => {
        const isValid = this.checkValidateInput();
        if (!isValid) return;

        const res = await createNewProject({
            name: this.state.name,
            note: this.state.note,
            imageBase64: this.state.imageBase64,
            descriptionHTML: this.state.descriptionHTML,
            descriptionMarkdown: this.state.descriptionMarkdown,
        });
        if (res && res.errCode === 0) {
            setTimeout(() => {
                toast.success("CREATE PROJECT SUCCESS!");
                this.props.fetchAllProject();
                this.props.toggleModal();
            }, 1000);

            this.setState({
                name: "",
                note: "",
                imageBase64: "",
                descriptionHTML: "",
                descriptionMarkdown: "",
            });
        } else {
            toast.error("CREATE PROJECT FAILED!");
            console.log("Create New Project: ", res);
        }
    };

    render() {
        const { isOpenModal, toggleModal } = this.props;
        const { name, note, descriptionMarkdown } = this.state;

        return (
            <Modal isOpen={isOpenModal} toggle={toggleModal} size="xl" centered>
                <div className="modal-header ">
                    <span className="left">THÊM ĐƠN HÀNG</span>
                    <span className="right" onClick={toggleModal}>
                        <i className="fas fa-times"></i>
                    </span>
                </div>
                <div className="add-new-project row p-3">
                    <div className="col-4 form-group">
                        <label>Tên dự án</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "name")
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>Ảnh</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(event) =>
                                this.handleOnchangeImage(event)
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>Mô tả dự án</label>
                        <input
                            type="text"
                            className="form-control"
                            value={note}
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "note")
                            }
                        />
                    </div>
                    <div className="col-12 my-4">
                        <button
                            className="btn-lg btn-primary"
                            onClick={() => this.handleSaveProject()}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return { fetchAllProject: () => dispatch(actions.fetchAllProject()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalOrder);
