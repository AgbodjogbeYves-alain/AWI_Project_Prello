import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
    }
    render(){
        return (

            <nav id="navBarBoard" className="navbar navbar-expand-lg navbar-dark bg-default">
                <ul className="navbar-nav align-items-lg-center ml-lg-auto navbar-nav-hover">
                    <li className="nav-item dropdown">
                        <a className="nav-link nav-link-icon" href="#" id="navbar-default_dropdown_1"
                           role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="ni ni-fat-add"/>
                            <span className="nav-link-inner--text d-lg-none">Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>
    )
    }

}