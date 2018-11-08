import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import Alert from '../Alert';
import AddUserInput from "../AddUserInput.js";
import asteroid from '../../../common/asteroid';
import AddTeamInput from './AddTeamInput';

class BoardModal extends Component {

    constructor(props) {
        super(props);

        let boardTeams = [];
        if(this.props.board) boardTeams = this.props.board.boardTeams;
        else if(this.props.activedTeam) boardTeams = [{team: this.props.activedTeam, teamRole: "admin"}]

        this.state = {
            type: this.props.board ? 'edit' : 'add',
            boardId: this.props.board ? this.props.board._id : '',
            boardTitle: this.props.board ? this.props.board.boardTitle : '',
            boardDescription: this.props.board ? this.props.board.boardDescription : '',
            boardUsers: this.props.board ? this.props.board.boardUsers : [{user: this.props.user, userRole: "admin"}],
            boardTeams: boardTeams,
            boardBackground: this.props.board ? this.props.board.boardBackground : "walnut",
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
            boardTitle: '',
            boardDescription: '',
            boardUsers: [{user: this.props.user, userRole: "admin"}],
            boardTeams: [],
            boardBackground: "walnut"
        });
    }

    handleCreateBoard(){
        let board = {
            boardTitle: this.state.boardTitle,
            boardDescription: this.state.boardDescription,
            boardUsers: this.state.boardUsers,
            boardTeams: this.state.boardTeams,
            boardBackground: this.state.boardBackground,
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
        board.boardUsers = this.state.boardUsers;
        board.boardTeams = this.state.boardTeams;
        board.boardBackground = this.state.boardBackground

        asteroid.call("boards.editBoard", board)
        .then((result) => {
            $('#board-modal' + this.state.boardId).modal('toggle');
            //that.props.history.push("/board/" + result.data._id)
        })
        .catch((error) => {
            this.addAlert("danger", error.reason)
        })
    }
    
    renderBackgrounds(){
        let backgrounds = ["walnut", "avenue", "pier", "tree", "boat", "heart", "hong-kong", "new-york-city", "sea", "vw-camper", "blue-watercolor", "blur-clean"];
        return backgrounds.map((b) =>
            <div className="col-6">
                <img 
                    className={"thumbnail" + (this.state.boardBackground === b ? " active" : "")}
                    src={"https://res.cloudinary.com/dxdyg7b5b/image/upload/c_thumb,h_100,w_130/v1541680096/backgrounds/"+ b +".jpg"}
                    onClick={() => this.handleChangeBackground(b)}
                />
            </div>
        );
    }

    handleChangeBackground(background){
        this.setState({boardBackground: background})
    }

    render(){
        return ( 
            <div className="modal board-modal fade" id={"board-modal" + this.state.boardId} tabIndex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true">
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
                            <div className="row">
                                <div className="col-8">
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
                                        <AddUserInput 
                                            addedUsers={this.state.boardUsers} 
                                            onChange={(field, value) => this.setState({"boardUsers": value})}
                                            type={"board"}
                                        />
                                        <AddTeamInput
                                            addedTeams={this.state.boardTeams}
                                            onChange={(field, value) => this.setState({"boardTeams": value})}
                                        />
                                    </form>
                                </div>
                                <div className="col-4">
                                    <h2>Background</h2>
                                    <div className="row backgrounds">
                                        {this.renderBackgrounds()}
                                    </div>
                                </div>
                            </div>
                            
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

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(withRouter(BoardModal));
