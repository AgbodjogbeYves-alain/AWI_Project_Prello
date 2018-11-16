import React, {Component} from 'react';
import asteroid from '../../../../common/asteroid';


export default class Teams extends Component {

    constructor(props) {
        super(props);
    }

    renderTeams(){
        return this.props.teams.map((t,i) =>
            <li key={i} className="nav-item" onClick={() => this.handleChangeActivedTeam(t)}>
                <div class={"nav-link mb-sm-3 mb-md-0 " + ((this.props.activedTeam && this.props.activedTeam._id == t._id) ? 'active' : '')} href="#">
                    {t.teamName}
                    <div class="dropdown float-right d-none">
                        <a class="btn-link btn-sm" data-toggle="dropdown" href="#" role="button">
                            <i class="ni ni-settings-gear-65 ni-lg"></i>
                        </a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item"
                                data-toggle="modal"
                                data-target={"#team-modal" + t._id}
                            >
                                <i class="ni ni-settings"></i>
                                Edit
                            </a>
                            <a class="dropdown-item" onClick={() => this.handleRemoveTeam(t)}>
                                <i class="ni ni-fat-remove"></i>
                                Remove
                            </a>
                        </div>
                    </div>
                </div>
            </li>
        )
    }

    handleChangeActivedTeam(team){
        this.props.onChange('activedTeam', team);
    }

    handleRemoveTeam(team){
        if(confirm("Are you sure to delete the team ?")) asteroid.call("teams.removeTeam", team);
    }

    render(){
        return(
            <div>
                <h2>Teams</h2>
                <div className="row">
                    <div className="col-12">
                        <ul className="col-12 team-nav nav nav-pills nav-fill flex-column flex-sm-row">
                            <li className="nav-item" onClick={() => this.handleChangeActivedTeam(null)}>
                                <a className={"nav-link mb-sm-3 mb-md-0" + (this.props.activedTeam ? '' : ' active')} href="#">My boards</a>
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
