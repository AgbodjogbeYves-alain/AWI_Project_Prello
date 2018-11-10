import React, { Component } from 'react';
import { connect } from 'react-redux';
import { callEnabledMails } from '../../../../actions/UserActions';
import asteroid from '../../../../common/asteroid';

class EnabledMailsinput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            enabledMails: this.props.user.profile.enabledMails
        };
    }

    changeEnabledMails(e){
        asteroid.call("users.setEnabledMails", e.target.checked);
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

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    dispatchCallEnabledMails: (val) => dispatch(callEnabledMails(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnabledMailsinput);