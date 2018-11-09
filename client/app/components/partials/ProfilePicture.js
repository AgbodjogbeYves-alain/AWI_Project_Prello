import React, { Component } from 'react'

export class ProfilePicture extends Component {

    getInitials(){
        let {lastname, firstname} = this.props.user.profile;
        return firstname.slice(0,1).toUpperCase()+lastname.slice(0,1).toUpperCase();
    }

    render() {
        let {lastname, firstname} = this.props.user.profile;
        return (
            <div className={"profile-picture size-" + this.props.size} data-toggle="tooltip" data-placement="top" 
                title={firstname + " " + lastname} 
            >
                {this.getInitials()}
            </div>
        )
    }
}

