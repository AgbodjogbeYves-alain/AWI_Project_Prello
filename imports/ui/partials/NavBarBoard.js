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
            members: []
        }
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

    render(){
        return (
            <nav id="navBarBoard" className="navbar navbar-expand-lg navbar-dark bg-default">
                <div className="container">
                    <a className="navbar-brand" href="#">{this.state.boardTitle}</a>
                </div>
                <div id={"containerTeam"} className="container">
                    <a className="navbar-item" href="#">{this.state.teams[0]}</a>
                </div>
                <div id={"containerMembers"} className="container">
                    {this.state.members.map((member) => {
                        return <span id={"aMember"} className="navbar-item" href="#">{member.firstname}</span>
                    })}
                </div>
            </nav>
    )
    }

}