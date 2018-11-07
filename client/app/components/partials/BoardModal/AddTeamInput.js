import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { connect } from 'react-redux';

class AddTeamInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addedTeams: this.props.addedTeams,
            teamName: "",
            teamRole: "user",
            alerts: []
        };
    }

    renderTeams(){
        return this.state.addedTeams.map((t,i) => 
            <div className="row" key={i}>
                <div className="col-7">
                    {t.team.teamName}
                </div>
                <div className="col-3">
                    <select 
                        className="mb-3" 
                        value={t.teamRole} 
                        onChange={(e) => this.handleChangeTeamRole(u, e.target.value)}
                    >
                        {this.renderRoleOptions()}
                    </select>
                </div>
                <div className="col-2">
                    <button className="btn btn-danger btn-sm" onClick={() => this.handleRemoveTeam(t.team._id)}>
                        x
                    </button>
                </div>
            </div>
        )
    }

    handleRemoveTeam(teamId){
        let newAddedTeams = this.state.addedTeams.filter((t) => t.team._id != teamId);
        this.setState({addedTeams: newAddedTeams});
        this.onChange();
    }

    handleAddTeam(){
        let addedTeams = this.state.addedTeams;
        let team = this.props.teams.filter((t) => t.teamName === this.state.teamName)[0]
        let alreadyTeam = this.state.addedTeams.filter((t) => t.team._id == team._id).length > 0;
        
        if(alreadyTeam) alert("This team has been already put.")
        else if(team){
            addedTeams.push({
                team: team,
                teamRole: this.state.teamRole
            });
            this.setState({addedTeams: addedTeams});
            this.setState({teamName: ''});
            this.onChange();
        }
        else this.addAlert("danger", "No user with this email.")
    }

    onChange(){
        this.props.onChange('addedUsers', this.state.addedTeams);
    }

    handleChangeTeamRole(addedTeam, teamRole){
        let newAddedTeams = this.state.addedTeams.map((t) => {
            if(t.team._id == addedTeam.team._id){
                t.teamRole = teamRole
            } 
            return t
        })

        this.setState({addedTeams: newAddedTeams});
        this.onChange();
    }

    renderRoleOptions(){
        let optionList = ['Admin', 'Member', 'Observer'];
        return optionList.map((o) => 
            <option value={o.toLowerCase()}>{o}</option>
        )
    }

    render(){
        return (
            <div className="form-group mb-3">
                {this.renderTeams()}
                <div className="row">
                    <div className="col-6">
                        <div className="input-group">
                            <Autocomplete
                                getItemValue={(item) => item.teamName}
                                shouldItemRender={(item, value) => item.teamName.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                items={this.props.teams}
                                renderItem={(item, isHighlighted) =>
                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                        {item.teamName}
                                    </div>
                                }
                                value={this.state.teamName}
                                onChange={(e) => this.setState({teamName: e.target.value})}
                                onSelect={(val) => this.setState({teamName: val})}
                                wrapperStyle={{'display': 'inline-block', 'width': '100%'}}
                                menuStyle={{left: 'auto', top: 'auto', position: 'fixed'}}
                                inputProps={{
                                    'placeholder': 'Team',
                                    'class': 'form-control w-100'
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-3" style={{paddingTop: "11px"}}>
                        <select 
                            className="mb-3" 
                            valus={this.state.teamRole} 
                            onChange={(e) => this.setState({teamRole: e.target.value})}
                        >
                            {this.renderRoleOptions()}
                        </select>
                    </div>
                    <div className="col-3">
                        <button className="btn btn-primary" onClick={() => this.handleAddTeam()}>Add</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    teams: state.teams
});

export default connect(mapStateToProps)(AddTeamInput);