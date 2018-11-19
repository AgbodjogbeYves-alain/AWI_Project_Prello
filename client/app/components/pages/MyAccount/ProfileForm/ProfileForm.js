import React, { Component } from 'react';
import { connect } from 'react-redux';

import Alert from "../../../partials/Alert.js"
import { callEditProfileUser } from '../../../../actions/UserActions.js';

class ProfileForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.user.profile.email,
            lastname: this.props.user.profile.lastname,
            firstname: this.props.user.profile.firstname,
            alerts: []
        };
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

    handleSubmit= (event) => {
        event.preventDefault();
        const { dispatchCallEditProfileUser, user } = this.props;
        let profile = user.profile;
        profile.email = this.state.email;
        profile.lastname = this.state.lastname;
        profile.firstname = this.state.firstname;
        let that = this;
        dispatchCallEditProfileUser(this.props.user._id, profile)
        .then(() => {
            that.addAlert("success", "Profile saved.");
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h1 style={{marginBottom: '20px'}}>Profile</h1>
                <div>
                    {this.renderAlerts()}
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <div className="input-group input-group-alternative mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="ni ni-hat-3"></i></span>
                            </div>
                            <input 
                                className="form-control form-control-alternative" 
                                placeholder="Lastname" 
                                type="text" 
                                value={this.state.lastname}
                                onChange={(e) => this.setState({lastname: e.target.value})}
                            />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <div className="input-group input-group-alternative mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="ni ni-hat-3"></i></span>
                            </div>
                            <input 
                                className="form-control form-control-alternative" 
                                placeholder="Firstname" 
                                type="text" 
                                value={this.state.firstname}
                                onChange={(e) => this.setState({firstname: e.target.value})}
                            />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="input-group input-group-alternative mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                            </div>
                                <input 
                                    className="form-control form-control-alternative" 
                                    placeholder="Email" 
                                    type="email"
                                    value={this.state.email}
                                    onChange={(e) => this.setState({email: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});
const mapDispatchToProps = dispatch => ({
    dispatchCallEditProfileUser: (email, lastname, firstname) => dispatch(callEditProfileUser(email, lastname, firstname)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);