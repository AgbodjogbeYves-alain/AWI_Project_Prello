import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import Alert from "../../../partials/Alert.js"

export default class ChangePasswordForm extends Component {

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
        else Meteor.call(
            'users.changePassword',
            this.actualPassword.value,
            this.newPassword.value,
            function(error){
                if(error) that.addAlert('danger', error.error);
                else{
                    that.resetForm();
                    that.addAlert('success', 'Password changed.');
                }  
            })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h1 style={{marginBottom: '20px'}}>Change Password</h1>
                {this.renderAlerts()}
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <div class="input-group input-group-alternative mb-4">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="ni ni-key-25"></i></span>
                            </div>
                            <input 
                                class="form-control form-control-alternative" 
                                placeholder="Actual password" 
                                type="password" 
                                ref={(p) => this.actualPassword = p}
                            />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">    
                    <div class="col-md-12">
                        <div class="form-group">
                            <div class="input-group input-group-alternative mb-4">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                            </div>
                            <input 
                                class="form-control form-control-alternative" 
                                placeholder="New password" 
                                type="password" 
                                ref={(p) => this.newPassword = p}
                            />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <div class="input-group input-group-alternative mb-4">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                            </div>
                                <input 
                                    class="form-control form-control-alternative" 
                                    placeholder="Confirm new password" 
                                    type="password"
                                    ref={(p) => this.newPassword2 = p}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <button type="submit" className="btn btn-primary">Change password</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}