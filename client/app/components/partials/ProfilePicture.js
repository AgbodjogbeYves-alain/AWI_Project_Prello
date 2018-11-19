import React, { Component } from 'react'

export class ProfilePicture extends Component {

    getInitials(){
        let {lastname, firstname} = this.props.user.profile;
        return (firstname ? firstname.slice(0,1).toUpperCase() : "") + (lastname ? lastname.slice(0,1).toUpperCase() : "");
    }
    getColor(){
        let {lastname, firstname} = this.props.user.profile;
        let colors = ["#11cdef", "#2dce89", "#f5365c", "#fb6340"]
        let index = (lastname+firstname).length % 4

        return colors[index];
        
    }

    render() {
        let {lastname, firstname} = this.props.user.profile;
        return (
            <div 
                className={"profile-picture size-" + this.props.size} 
                data-toggle="tooltip" 
                data-placement="top" 
                style={{backgroundColor: this.getColor()}}
                title={firstname + " " + lastname} 
            >
                {this.getInitials()}
            </div>
        )
    }
}

