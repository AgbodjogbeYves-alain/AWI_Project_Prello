import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

export default class EnabledMailsinput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            enabledMails: this.props.user.profile.enabledMails
        };
    }

    changeEnabledMails(e){
        this.setState({enabledMails: e.target.checked});
        Meteor.call('users.setEnabledMails', e.target.checked)
    }

    render() {
        return (
            <div className="card-profile-actions py-4 mt-lg-0">
                <label className="custom-toggle">
                    <input 
                        type="checkbox" 
                        defaultChecked={this.state.enabledMails}
                        onChange={(e) => this.changeEnabledMails(e)}
                    />
                    <span className="custom-toggle-slider rounded-circle"></span>
                </label>
                <h6>Enabled Mails</h6>
            </div>
        )
    }
}