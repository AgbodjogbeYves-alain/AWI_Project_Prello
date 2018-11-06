import React, {Component} from 'react';


export default class Teams extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activedTeam: null
        }
    }

    renderTeams(){
        
        return this.props.teams.map((t,i) =>
            <li key={i} className="nav-item" onClick={() => this.setState({activedTeam: t})}>
                <a class={"nav-link mb-sm-3 mb-md-0 " + ((this.state.activedTeam && this.state.activedTeam._id == t._id) ? 'active' : '')} href="#">
                    {t.teamName}
                </a>
            </li>
        )
    }

    render(){
        return(
            <div>
                <h2>Teams</h2>
                <div className="row">
                    <div className="col-12">
                        <ul className="col-12 team-nav nav nav-pills nav-fill flex-column flex-sm-row">
                            <li className="nav-item" onClick={() => this.setState({activedTeam: null})}>
                                <a className={"nav-link mb-sm-3 mb-md-0" + (this.state.activedTeam ? '' : ' active')} href="#">Mes boards</a>
                            </li>
                            {this.renderTeams()}
                        </ul>
                    </div>
                    <div className="col-12">
                        <button className="btn btn-success" data-toggle="modal" data-target="#team-modal">
                            Create a new team
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}