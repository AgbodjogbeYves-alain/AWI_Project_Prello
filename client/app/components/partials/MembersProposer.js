import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { GithubPicker } from 'react-color';
import asteroid from '../../common/asteroid';
import {Title} from "../pages/Utils/Utils";
import {callEditBoard} from "../../actions/BoardActions";
import {callEditCard} from "../../actions/CardActions";
import {callCreateLabel, callEditLabels, callRemoveLabel} from "../../actions/LabelActions";

class MemberProposer extends Component {


    addMemberToCard = (event,user) => {
        event.preventDefault()
        console.log(user)
        /*
        calleditCard(idBoard,idList,newCard)
        */
    }
    render(){
            return (
                    <div>
                        <div className="card card-stats mb-4 mb-lg-0 cardForOptions">
                            <div className="card-body">
                                <ul>
                                    {this.props.members.map((user) =>
                                        <li><a onClick={this.addMemberToCard(user)}>{user.profile.lastname}+' '+{user.profile.firstname}</a></li>
                                    )}
                                </ul>
                                
                            </div>
                        </div>
                </div>
            );
        }


}

const mapStateToProps = state => ({
    user: state.user,
    users: state.users,
    boards: state.boards

});

export default connect(mapStateToProps)(MemberProposer);



