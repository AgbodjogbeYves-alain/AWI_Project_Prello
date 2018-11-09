import React, { Component } from 'react'

export class ProfilePicture extends Component {

    getInitials(){
        let lastname = this.props.user.profile.lastname;
        let firstname = this.props.user.profile.firstname;
        return lastname.slice(0,1).toUpperCase()+firstname.slice(0,1).toUpperCase();
    }

    render() {
        return (
            <div className={"profile-picture size-" + this.props.size}>
                {this.getInitials()}
            </div>
        )
    }
}

