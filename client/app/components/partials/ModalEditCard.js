import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { GithubPicker } from 'react-color';
import asteroid from '../../common/asteroid';
import {Title} from "../pages/Utils/Utils";
import CardOptions from "./CardOptions";
import {callEditCard} from "../../actions/CardActions";


class ModalEditCard extends Component {


    constructor(props) {
        super(props);
        this.state = {
            idList: this.props.idList,
            idBoard: this.props.idBoard,
            card: this.props.card,
            cardTitle: this.props.card.cardTitle,
            cardComments: this.props.card.cardComment,
            newComment: "",
            hiddenMembers: true,
            hiddenDeadline: true,
            hiddenLabels: true,
            newDescription: ''
        };

        this.titleToInput = this.titleToInput.bind(this)
        this.inputToTitle = this.inputToTitle.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this)
        this.toggleDisplay = this.toggleDisplay.bind(this)
        this.addComponent = this.addComponent.bind(this)
    }

    inputToTitle = (event) =>{
        event.preventDefault();
        const input = document.getElementById('title'+this.props.card._id);
        this.updateCardName(input.value);
        const title = document.createElement("h3");
        title.innerHTML = input.value;
        title.style= "padding:8px";
        title.id = 'title'+this.props.card._id;
        title.onclick = this.titleToInput;
        input.parentNode.replaceChild(title, input);
    }

    titleToInput = (event) =>{
        event.preventDefault();
        const title = document.getElementById('title'+this.props.card._id);
        const input = document.createElement("input");
        input.value = title.innerText;
        input.style = "font-size: 40px;padding: 8px"
        input.id = 'title'+this.props.card._id;
        input.onblur = this.inputToTitle;
        input.className = "form-control w-100";
        title.parentNode.replaceChild(input, title);
        input.focus();
    }


    updateCardName(value) {
        let newCard = this.state.card
        newCard.cardTitle = value
        console.log(value)
        callEditCard(this.state.idBoard,this.state.idList,newCard)
    }

    handleAddComment = (event) => {
        event.preventDefault();
        let newComment = {
            commentText: this.state.newComment,
            commentUserId: this.props.user._id
        }

        console.log(newComment)
    };

    toggleDisplay = (labelButton) => {
        let previousHM = this.state.hiddenMembers
        let previousHL = this.state.hiddenLabels
        let previousDeadL = this.state.hiddenDeadline
        console.log(labelButton)
        if(labelButton == 'labels'){
            console.log('workd')
            this.setState({
                hiddenLabels: !previousHL,
                hiddenDeadline: true,
                hiddenMembers: true
            })
        }else if(labelButton == 'members'){
            console.log('workd')
            console.log(previousHM)
            this.setState({
                hiddenLabels: true,
                hiddenMembers: !previousHM,
                hiddenDeadline: true
            })
        }else if(labelButton == 'deadline'){
            console.log('workd')
            this.setState({
                hiddenLabels: true,
                hiddenMembers: true,
                hiddenDeadline: !previousDeadL
            })
        }


    }

    addComponent = (labelButton) => {
        if(labelButton=='labels' && !this.state.hiddenLabels){
            console.log(this.props.boardLabels)
            return <CardOptions function="labels" card={this.props.card} boardLabels={this.props.boardLabels} idList={this.state.idList} idBoard={this.state.idBoard}/>
        }else if(labelButton == 'members' && !this.state.hiddenMembers){
            return <CardOptions function="members" card={this.props.card} idList={this.state.idList} idBoard={this.state.idBoard}/>
        }else if(labelButton == 'deadline' && !this.state.hiddenDeadline){
            return <CardOptions function="deadline" card={this.props.card} idList={this.state.idList} idBoard={this.state.idBoard}/>

        }
    }

    handleAddDescription = (event) => {
        event.preventDefault()
        console.log(this.state.cardDescription)
    }

    render(){
        return (
            <div className="modal fade modalCard" id={"card-modal" + this.state.card._id} tabIndex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true" style={{width:1700+'px'}}>
                <div className="modal-dialog modal- modal-dialog-centered modal-" role="document">
                    <div className="modal-content modalContentCard">

                        <div className="modal-header">
                            <Title id={'title'+this.props.card._id} onClick={this.titleToInput}>{this.props.card.cardTitle}</Title>

                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>

                        <div className="modal-body modalContentCard">
                            <div className="labelForCard">
                                {this.props.cardLabels.forEach((label) => {
                                    console.log(label.color)
                                })}
                            </div>
                            <div className="formCardModal">
                                <form role="form" onSubmit={(e) => e.preventDefault()}>
                                    <div className="form-group mb-3">
                                        <div>
                                            <div id={"descriptionDiv"}>
                                                <span> Description </span>

                                                <textarea
                                                    className="form-control"
                                                    placeholder="Add description"
                                                    type="text"
                                                    value={this.props.card.cardDescription}
                                                    onChange={(e) => this.setState({
                                                        newDescription: e.target.value
                                                    })}/>
                                                <button type="button" className="btn btn-success cardButtonEdit" onClick={this.handleAddDescription}>Add</button>

                                            </div>

                                        </div>
                                    </div>
                                    <div className="form-group mb-3">
                                        <div id={"commentDiv"}>
                                            <span> Add comment </span>

                                            <textarea
                                                className="form-control"
                                                placeholder="Add Comment"
                                                type="text"
                                                onChange={(e) => this.setState({
                                                    cardComment: e.target.value
                                                })}/>
                                            <button type="button" className="btn btn-success cardButtonEdit" onClick={this.handleAddComment}>Add</button>
                                        </div>
                                    </div>
                                    <div className="form-group mb-3">
                                        <div className="input-group input-group-alternative">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"/>
                                            </div>
                                            <div id={"listComment"}>
                                                <span> Comment list </span>
                                            </div>

                                        </div>
                                    </div>
                                </form>
                                <div id={'cardactivitydiv'}>
                                    <span> Activité </span>

                                </div>
                            </div>
                            <div className={'cardactiondiv'}>
                                <span> Action </span>
                                <ul className={'actionUl'}>
                                    <li><button type="button" className="btn btn-secondary cardButtonEdit">Archiver</button></li>
                                    <li>
                                        <button className="btn btn-secondary cardButtonEdit " type="button"
                                                onClick={(e) =>{
                                                    e.preventDefault()
                                                    this.toggleDisplay('members')
                                                }}>
                                            Members
                                        </button>
                                        {this.addComponent('members')}


                                    </li>
                                    <li>
                                        <button className="btn btn-secondary cardButtonEdit" type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    this.toggleDisplay('labels')
                                                }}>Labels</button>
                                        {this.addComponent('labels')}
                                    </li>
                                    <li>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-secondary cardButtonEdit">CheckList</button>
                                        </div>
                                    </li>
                                    <li>
                                        <button className="btn btn-secondary cardButtonEdit " type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    this.toggleDisplay('deadline')
                                                }}>Deadline</button>

                                        {this.addComponent('deadline')}

                                    </li>

                                </ul>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(ModalEditCard);



