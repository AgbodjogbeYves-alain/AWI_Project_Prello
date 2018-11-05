import React, { Component } from "react";
import {Route, withRouter} from 'react-router-dom'

class ModalFormCreateTeam extends Component {
    constructor(props){
        super(props);

        this.state={
            teamName:'',
            teamDescription:''
        };

        this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
        this.handleTeamDescriptionChange = this.handleTeamDescriptionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    };

    handleTeamNameChange(event){
        this.setState({teamName:event.target.value})
    }

    handleTeamDescriptionChange(event){
        this.setState({teamDescription:event.target.value})
    }

    handleSubmit(event){
        event.preventDefault();

        let teamName = this.state.teamName;
        let description = this.state.description;


        Meteor.call('createTeam',{teamName,description},(error,result) => {
            if(error)
            {
                alert(error) 

            }
            else
            {
                
                this.props.history.push('/myaccount');
            }
        });
    }

    render(){
        return(
            <div  className="modal fade show" id="team-modal" tabIndex="-1" role="dialog" aria-labelledby="modal-form">
                <div className="modal-dialog modal- modal-dialog-centered modal-sm" role="document">
                  <div className="modal-content">
                   <div className="modal-body p-0">
                        <div className="card-body px-lg-5 py-lg-5">
                            <div className="text-center text-muted mb-4">
                               <small>Create a Team</small>
                            </div>
                            <form role="form" onSubmit={this.handleSubmit}>
                                <div className="form-group mb-3">
                                    <div className="form-group">
                                        <div className="input-group input-group-alternative">
                                             <input className="form-control" placeholder="Team name" type="text" value={this.state.teamName} onChange={this.handleTeamNameChange}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                     <label>Description(optional) </label>   
                                            <div className="input-group input-group-alternative">
                                                    <textarea className="form-control" value={this.state.teamDescription} onChange={this.handleTeamDescriptionChange}></textarea>
                                            </div>
                                       
                                    </div>

                                                
                                </div>
                                <div className="text-center">
                                    <button>Create team</button>
                                </div>
    

                            </form>
                        </div>
                   </div>
                  </div>
                </div>     
            </div>
        )
    }
}

export default withRouter(ModalFormCreateTeam);