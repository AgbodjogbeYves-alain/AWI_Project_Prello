import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withRouter } from "react-router-dom";


export default class NavBarBoard extends Component {

    constructor(props){
        super(props);
        this.state = {
            boardTitle : "",
            privacy: "Public",
            teams: [],
            members: [],
            settingVisible: false
        }

        this.showDivSettings = this.showDivSettings.bind(this)
        this.handleSubmitTitle = this.handleSubmitTitle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        let teamsB = ["Personal"];
        if(!(nextProps.teams.length === 0)){
            if(nextProps.teams.length > 1){
                teamsB = ["Multiple teams"]
            }else{
                teamsB = [nextProps.teams[0].teamName]
            }
        }

        this.setState({
            boardTitle: nextProps.boardTitle,
            privacy: nextProps.boardPrivacy,
            teams: teamsB,
            members: nextProps.members

        })

    }


    showDivSettings = (event) =>{
        event.preventDefault()
        document.getElementById("divSettings").fadeIn('slow')
    }

    handleSubmitTitle = (event) => {
        event.preventDefault()
        Meteor.call()
    }
    render(){
        return (

            <nav id="navBarBoard" className="navbar navbar-expand-lg navbar-dark bg-default">
                <div>
                    <a className="navbar-brand">{this.state.boardTitle}</a>
                </div>
                <div id={"containerTeam"}>
                    <a className="navbar-item" href="#">{this.state.teams[0]}</a>
                </div>
                <div id={"containerMembers"}>
                    {this.state.members.map((member) => {
                        return <a className="navbar-item" href="#">{member.firstname}</a>
                    })}
                </div>

                <div className={"divSettings"}>
                    <a className="dropdown-item" onClick={this.showDivSettings}><i className="ni ni-settings-gear-65"/></a>
                </div>
            </nav>
    )
    }

}