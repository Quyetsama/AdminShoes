import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from "../../../utils";
import * as actions from "../../../store/actions";
import "./ManagePosts.scss";
import { FormattedMessage } from "react-intl";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import ModalPosts from "./Modal/ModalPosts";
import ModalEditPosts from "./Modal/ModalEditPosts";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt();

class ManagePosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrPosts: [],
      isOpenModal: false,
      isOpenEditModal: false,
      postsEdit: {},
    };
  }

  async componentDidMount() {
    this.props.fetchAllPosts();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.posts !== this.props.posts) {
      this.setState({
        arrPosts: this.props.posts,
      });
    }
    if (prevProps.posts !== this.props.posts) {
      this.setState({
        name: "",
        note: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });
    }
  }

  toggleModal = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  };
  toggleEditModal = () => {
    this.setState({
      isOpenEditModal: !this.state.isOpenEditModal,
    });
  };

  editPosts = (post) => {
    this.setState({
      isOpenEditModal: true,
      postsEdit: post,
    });
  };

  handleEditModal = (post) => {
    this.props.editAPosts(post);
    this.setState({
      isOpenEditModal: false,
    });
  };

  handleDelete = (post) => {
    this.props.deleteAPosts(post.id);
  };

  render() {
    const { arrPosts, isOpenModal, isOpenEditModal, postsEdit } = this.state;
    return (
      <div className="manage-posts-container">
        <button className="btn-success btn-lg my-3" onClick={this.toggleModal}>
          THÊM BÀI VIẾT
        </button>
        <div className="ms-title">Quản lí bài viết</div>
        <ModalPosts isOpenModal={isOpenModal} toggleModal={this.toggleModal} />
        {isOpenEditModal && (
          <ModalEditPosts
            isOpenEditModal={isOpenEditModal}
            postsEdit={postsEdit}
            toggleEditModal={this.toggleEditModal}
            handleEditModal={this.handleEditModal}
          />
        )}
        <div className="manage-posts-body">
          <div className="row">
            <div className="col-12">
              <table id="TableManagerUser">
                <tbody>
                  <tr>
                    <th>Tên bài viết</th>
                    <th>Actions</th>
                  </tr>
                  {arrPosts && arrPosts.length > 0 ? (
                    arrPosts.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>
                            <button
                              onClick={() => this.editPosts(item)}
                              className="btn-edit"
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>
                            <button
                              onClick={() => this.handleDelete(item)}
                              className="btn-delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Không có
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    posts: state.admin.posts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllPosts: () => dispatch(actions.fetchAllPosts()),
    editAPosts: (data) => {
      dispatch(actions.editAPosts(data));
    },
    deleteAPosts: (id) => dispatch(actions.deleteAPosts(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePosts);
