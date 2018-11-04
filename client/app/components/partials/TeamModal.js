import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import Alert from './Alert';
import AddUserInput from "./AddUserInput.js";
import asteroid from '../../common/asteroid';

class TeamModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.team ? 'edit' : 'add',
            teamId: this.props.team ? this.props.team._id : '',
            teamTitle: this.props.team ? this.props.team.teamTitle : '',
            teamDescription: this.props.team ? this.props.team.teamDescription : '',
            teamUsers: this.props.team ? this.props.team.teamUsers : [],
            alerts: []
        };

        this.handleCreateTeam = this.handleCreateTeam.bind(this);
        this.handleEditTeam = this.handleEditTeam.bind(this);
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
            teamTitle: ''
        });
    }

    handleCreateTeam(){
        let team = {
            teamTitle: this.state.teamTitle,
            teamDescription: this.state.teamDescription,
            teamUsers: this.state.teamUsers
        };

        asteroid.call("teams.createTeam", team)
        .then((result) => {
            $('#team-modal' + this.state.teamId).modal('toggle');
        })
        .catch((error) => {
            this.addAlert("danger", error.reason)
        })
    }

    handleEditTeam(){
        let team = this.props.team;
        team.teamTitle = this.state.teamTitle;
        team.teamDescription = this.state.teamDescription;
        team.teamUsers = this.state.teamUsers;
        
        asteroid.call("teams.editTeam", team)
        .then((result) => {
            $('#team-modal' + this.state.teamId).modal('toggle');
        })
        .catch((error) => {
            this.addAlert("danger", error.reason)
        })
    }

    render(){
        return ( 
            <div className="modal fade" id={"team-modal" + this.state.teamId} tabIndex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true">
                <div className="modal-dialog modal- modal-dialog-centered modal-" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h6 className="modal-title" id="modal-title-default">
                                {this.state.type == 'edit' ? "Edit" : "Create"} team {this.state.teamTitle}
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
                                            value={this.state.teamTitle}
                                            onChange={(e) => this.setState({teamTitle: e.target.value})}
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
                                            value={this.state.teamDescription}
                                            onChange={(e) => this.setState({teamDescription: e.target.value})}
                                        ></textarea>
                                    </div>
                                </div>
                                <AddUserInput 
                                    addedUsers={this.state.teamUsers} 
                                    onChange={(field, value) => this.setState({"teamUsers": value})}
                                />
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-link" data-dismiss="modal">Close</button>
                            {this.state.type == "edit" ?
                                <button 
                                    className="btn btn-primary  ml-auto"
                                    onClick={() => this.handleEditTeam()}>
                                    Edit
                                </button>
                                :
                                <button 
                                    className="btn btn-success  ml-auto"
                                    onClick={() => this.handleCreateTeam()}>
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

export default connect(mapStateToProps)(withRouter(TeamModal));
