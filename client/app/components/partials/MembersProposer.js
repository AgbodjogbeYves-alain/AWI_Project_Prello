import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { GithubPicker } from 'react-color';
import asteroid from '../../common/asteroid';
import {Title} from "../pages/Utils/Utils";
import {callEditBoard} from "../../actions/BoardActions";
import {callEditCard} from "../../actions/CardActions";
import {callCreateLabel, callEditLabels, callRemoveLabel} from "../../actions/LabelActions";
import {ProfilePicture} from "./ProfilePicture";

class MemberProposer extends Component {

    constructor(props){
        super(props);
        this.addMemberToCard = this.addMemberToCard.bind(this)
    }


    addMemberToCard = (user,index) => {
        let newCard = this.props.card
        let button = document.getElementById("btnNameMember"+index)
        if(newCard.cardUsers){
            if(newCard.cardUsers.includes(user._id)){
                //button.firstChild = user.profile.lastname+' '+user.profile.firstname+;
                button.innerHTML = user.profile.lastname+' '+user.profile.firstname
                newCard.cardUsers = newCard.cardUsers.filter((id) => id!= user._id)
            }else{
                button.innerHTML = user.profile.lastname+' '+user.profile.firstname+' '+'<i class="ni ni-check-bold"/>'
                newCard.cardUsers.push(user._id)
            }
        }else{

            newCard.cardUsers = [user._id]
        }

        callEditCard(this.props.idBoard,this.props.idList,newCard)

    }

    render(){
            return (
                <div>
                    <div className="card card-stats mb-4 mb-lg-0 cardForOptions">
                        <div className="card-body">
                            <ul className={"actionUl"}>
                                {this.props.members.map((user,index) =>
                                        <li className={"actionMemLi"}>
                                            <button type='button' key={index} id={"btnNameMember"+index} className={"btn btn-secondary btnNameMember"}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.addMemberToCard(user,index)
                                                    }}> {user.profile.lastname} {user.profile.firstname}
                                            </button>
                                        </li>
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



