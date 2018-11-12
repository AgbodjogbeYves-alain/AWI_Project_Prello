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
            teamName: this.props.team ? this.props.team.teamName : '',
            teamDescription: this.props.team ? this.props.team.teamDescription : '',
            teamMembers: this.props.team ? this.props.team.teamMembers : [{userId: this.props.user._id, role: "admin"}],
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
            teamName: ''
        });
    }

    handleCreateTeam(){
        let team = {
            teamName: this.state.teamName,
            teamDescription: this.state.teamDescription,
            teamMembers: this.state.teamMembers,
        };
        console.log(team)
        asteroid.call("teams.createTeam", team)
        .then((result) => {
            $('#team-modal' + this.state.teamId).modal('toggle');
            this.resetFields();
        })
        .catch((error) => {
            this.addAlert("danger", error.reason)
        })
    }

    resetFields(){
        this.setState({
            teamName: '',
            teamDescription: '',
            teamMembers: []
        })
    }

    handleEditTeam(){
        let team = this.props.team;
        team.teamName = this.state.teamName;
        team.teamDescription = this.state.teamDescription;
        team.teamMembers = this.state.teamMembers;

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
                                {this.state.type == 'edit' ? "Edit" : "Create"} team {this.state.teamName}
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
                                            value={this.state.teamName}
                                            onChange={(e) => this.setState({teamName: e.target.value})}
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
                                    addedUsers={this.state.teamMembers} 
                                    onChange={(field, value) => this.setState({"teamMembers": value})}
                                    type={'team'}
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

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(withRouter(TeamModal));
