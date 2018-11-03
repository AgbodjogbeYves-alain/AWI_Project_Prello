import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { callCreateBoard, callEditBoard } from '../../actions/BoardActions';
import Alert from './Alert';
import asteroid from '../../common/asteroid';

class BoardModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.board ? 'edit' : 'add',
            boardId: this.props.board ? this.props.board._id : '',
            boardTitle: this.props.board ? this.props.board.boardTitle : '',
            boardDescription: this.props.board ? this.props.board.boardDescription : '',
            boardUsers: this.props.board ? this.props.board.boardUsers : [],
            userEmail: "",
            userAdmin: false,
            alerts: []
        };

        this.handleCreateBoard = this.handleCreateBoard.bind(this);
        this.handleEditBoard = this.handleEditBoard.bind(this);
    }

    addAlert(type, text) {
        let newAlerts = this.state.alerts;
        newAlerts.push({type: type, text: text});

        this.setState({
            alerts: newAlerts
        });
    }

    renderAlerts(){
        return this.state.alerts.map(a => (<Alert key={this.state.alerts.indexOf(a)} type={a.type}  text={a.text}/>));
    }

    resetFields(){
        this.setState({
            boardTitle: ''
        });
    }

    handleCreateBoard(){
        let board = {
            boardTitle: this.state.boardTitle,
            boardDescription: this.state.boardDescription,
            boardPrivacy: 1
        };
        asteroid.call("boards.createBoard", board)
        .then((result) => {
            this.props.history.push("/board/" + result)
        })
        .catch((error) => {
            this.addAlert("danger", error.reason)
        })
    }

    handleEditBoard(){
        let board = this.props.board;
        board.boardTitle = this.state.boardTitle;
        board.boardDescription = this.state.boardDescription;

        asteroid.call("boards.editBoard", board)
        .then((result) => {
            $('#board-modal' + this.state.boardId).modal('toggle');
            //that.props.history.push("/board/" + result.data._id)
        })
        .catch((error) => {
            this.addAlert("danger", error.reason)
        })
    }

    renderUsers(){
        return this.state.boardUsers.map((u,i) => 
            <div className="row" key={i}>
                <div className="col-7">
                    {u.user.profile.email}
                </div>
                <div className="col-3">
                <div className="custom-control custom-checkbox mb-3">
                        <input 
                            className="custom-control-input" 
                            id="adminCheck" 
                            type="checkbox" 
                            defaultChecked={u.userAdmin}
                            //onChange={(e) => this.setState({userAdmin: e.target.checked})}
                        />
                        <label className="custom-control-label" htmlFor="adminCheck">Admin</label>
                    </div>
                </div>
                <div className="col-2">
                    <button className="btn btn-danger btn-sm">
                        x
                    </button>
                </div>
            </div>
        )
    }

    handleAddUser(){
        let boardUsers = this.state.boardUsers;
        asteroid.call('users.getUser', this.state.userEmail)
        .then((result) => {
            if(result){
                boardUsers.push({
                    user: result,
                    userAdmin: this.state.userAdmin
                });
                this.setState({boardUsers: boardUsers});
            }
            else this.addAlert("danger", "No user with this email.")
        })
        .catch((error) => this.addAlert("danger", error.reason));
    }

    render(){
        return ( 
            <div className="modal fade" id={"board-modal" + this.state.boardId} tabIndex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true">
                <div className="modal-dialog modal- modal-dialog-centered modal-" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h6 className="modal-title" id="modal-title-default">
                                {this.state.type == 'edit' ? "Edit" : "Create"} Board {this.state.boardTitle}
                            </h6>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div>
                                {this.renderAlerts()}
                            </div>
                            <form role="form" onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group mb-3">
                                    <div className="input-group input-group-alternative">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                                        </div>
                                        <input 
                                            className="form-control" 
                                            placeholder="Name" 
                                            type="text"
                                            value={this.state.boardTitle}
                                            onChange={(e) => this.setState({boardTitle: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <div className="input-group input-group-alternative">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                                        </div>
                                        <textarea 
                                            className="form-control" 
                                            placeholder="Description" 
                                            type="text"
                                            value={this.state.boardDescription}
                                            onChange={(e) => this.setState({boardDescription: e.target.value})}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    {this.renderUsers()}
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="input-group input-group-alternative">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                                                </div>
                                                <input 
                                                    className="form-control" 
                                                    placeholder="Email" 
                                                    type="email"
                                                    value={this.state.userEmail}
                                                    onChange={(e) => this.setState({userEmail: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-3" style={{paddingTop: "11px"}}>
                                            <div className="custom-control custom-checkbox mb-3">
                                                <input 
                                                    className="custom-control-input" 
                                                    id="adminCheck" 
                                                    type="checkbox" 
                                                    defaultChecked={this.state.userAdmin}
                                                    onChange={(e) => this.setState({userAdmin: e.target.checked})}
                                                />
                                                <label className="custom-control-label" htmlFor="adminCheck">Admin</label>
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <button className="btn btn-primary" onClick={() => this.handleAddUser()}>Add</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-link" data-dismiss="modal">Close</button>
                            {this.state.type == "edit" ?
                                <button 
                                    className="btn btn-primary  ml-auto"
                                    onClick={() => this.handleEditBoard()}>
                                    Edit
                                </button>
                                :
                                <button 
                                    className="btn btn-success  ml-auto"
                                    onClick={() => this.handleCreateBoard()}>
                                    Create
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(withRouter(BoardModal));
