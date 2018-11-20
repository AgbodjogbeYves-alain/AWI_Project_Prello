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
        return this.state.addedTeams.map((teamId,i) => {
            let team = this.props.teams.filter((t) => t._id === teamId)[0];
            if(!team) return "";
            return(<div className="row" key={i}>
                <div className="col-10">
                    {team.teamName}
                </div>
                <div className="col-2">
                    <button className="btn btn-danger btn-sm deleteAddMember" onClick={() => this.handleRemoveTeam(teamId)}>
                        x
                    </button>
                </div>
            </div>)
        })
    }

    handleRemoveTeam(teamId){
        let newAddedTeams = this.state.addedTeams.filter((t) => t != teamId);
        this.setState({addedTeams: newAddedTeams});
        let team = this.props.teams.filter((t) => t._id === teamId)[0]
        this.props.onChange("removeTeam", team);
    }

    handleAddTeam(){
        let addedTeams = this.state.addedTeams;
        let team = this.props.teams.filter((t) => t.teamName === this.state.teamName)[0]
        let alreadyTeam = this.state.addedTeams.filter((t) => t == team._id).length > 0;

        if(alreadyTeam) alert("This team has been already put.")
        else if(team){
            addedTeams.push(team._id);
            this.setState({addedTeams: addedTeams});
            this.setState({teamName: ''});
            this.props.onChange("addTeam", team);
        }
        else this.addAlert("danger", "No user with this email.")
    }

    onChange(){
        this.props.onChange('addedTeams', this.state.addedTeams);
    }

    render(){
        return (
            <div className="form-group mb-3">
                {this.renderTeams()}
                <div className="row">
                    <div className="col-9">
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
                                menuStyle={{left: 'auto', top: 'auto', position: 'fixed', "zIndex": "10"}}
                                inputProps={{
                                    'placeholder': 'Team',
                                    'class': 'form-control w-100'
                                }}
                            />
                        </div>
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
