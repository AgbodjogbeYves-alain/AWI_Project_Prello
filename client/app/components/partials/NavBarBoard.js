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
                <div>
                    <div className="navbar-brand dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.boardTitle}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#">Action</a>
                            <a className="dropdown-item" href="#">Another action</a>
                            <a className="dropdown-item" href="#">Something else here</a>
                        </div>
                    </div>
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