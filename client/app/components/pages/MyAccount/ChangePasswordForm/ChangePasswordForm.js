import React, { Component } from 'react';
import { connect } from 'react-redux';

import Alert from "../../../partials/Alert.js"
import asteroid from '../../../../common/asteroid.js';

class ChangePasswordForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
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

    resetForm(){
        this.actualPassword.value = '';
        this.newPassword.value = '';
        this.newPassword2.value =  '';
    }

    handleSubmit= (event) => {
        event.preventDefault();
        let that = this;
        if(this.newPassword.value.length < 6) this.addAlert('danger', 'The password should have at least 6 characters.')
        else if(this.newPassword.value !== this.newPassword2.value) this.addAlert('danger', "The two passwords doesn't match.")
        else {
            asteroid.call('users.changePassword', this.actualPassword.value, this.newPassword.value)
            .then(result => {
                that.resetForm();
                that.addAlert('success', 'Password changed.')
            })
            .catch((error) => that.addAlert('danger', error.error))
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h1 style={{marginBottom: '20px'}}>Change Password</h1>
                {this.renderAlerts()}
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="input-group input-group-alternative mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="ni ni-key-25"></i></span>
                            </div>
                            <input 
                                className="form-control form-control-alternative" 
                                placeholder="Actual password" 
                                type="password" 
                                ref={(p) => this.actualPassword = p}
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
                                <span className="input-group-text"><i className="ni ni-lock-circle-open"></i></span>
                            </div>
                            <input 
                                className="form-control form-control-alternative" 
                                placeholder="New password" 
                                type="password" 
                                ref={(p) => this.newPassword = p}
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
                                <span className="input-group-text"><i className="ni ni-lock-circle-open"></i></span>
                            </div>
                                <input 
                                    className="form-control form-control-alternative" 
                                    placeholder="Confirm new password" 
                                    type="password"
                                    ref={(p) => this.newPassword2 = p}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Change password</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(ChangePasswordForm);