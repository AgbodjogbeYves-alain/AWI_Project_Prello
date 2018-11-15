import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { GithubPicker } from 'react-color';
import asteroid from '../../common/asteroid';
import {Title} from "../pages/Utils/Utils";
import {callEditBoard} from "../../actions/BoardActions";
import {callEditCard} from "../../actions/CardActions";
import {callCreateLabel, callEditLabels, callRemoveLabel} from "../../actions/LabelActions";
import MembersProposer from './MembersProposer';

class MemberAdd extends Component {


    constructor(props) {
        super(props);
        this.state = {
            board: this.props.boards.filter((board) => board._id == this.props.idBoard)[0],
            members: []
        }
        this.refreshUsers = this.refreshUsers.bind(this)
    }

    refreshUsers = (e) => {
        let newName = e.target.value
        console.log(this.state.board)
        let usersId = this.state.board.boardUsers.map((user) => {
            return user.userId
        })

        console.log(this.props.users)
       
        let members = this.props.users.filter((user) => usersId.includes(user._id))
        this.setState({
            members: members
        })
        console.log(usersId)
        console.log(members)
        
    }
    render(){
            return (
                    <div>
                        <div className="card card-stats mb-4 mb-lg-0 cardForOptions">
                            <div className="card-body">
                                <input placeholder="Enter the name of the user" onKeyPress={this.refreshUsers}></input>
                                <MembersProposer member={this.state.members} card={this.props.cards} idList={this.props.idList} idBoard={this.props.idBoard}/>
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

export default connect(mapStateToProps)(MemberAdd);



