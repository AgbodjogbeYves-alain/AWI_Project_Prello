import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Title} from "../pages/Utils/Utils";
import CardOptions from "./CardOptions";
import {callAddCommentCard, callEditCard, callRemoveCard} from "../../actions/CardActions";


class ModalEditCard extends Component {


    constructor(props) {
        super(props);
        this.state = {
            idList: this.props.idList,
            idBoard: this.props.idBoard,
            cardLabels: this.props.labels.filter((label) => this.props.card.cardLabels.includes(label._id) ),
            card: this.props.card,
            cardTitle: this.props.card.cardTitle,
            cardComments: this.props.card.cardComments,
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
        this.handleChangeStatus = this.handleChangeStatus.bind(this)
        this.unorarchive = this.unorarchive.bind(this)
        this.renderDeleteButton = this.renderDeleteButton.bind(this)
        this.handleDeleteCard = this.handleDeleteCard.bind(this)
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
        callEditCard(this.state.idBoard,this.state.idList,newCard)
    }

    handleAddComment = (event) => {
        event.preventDefault();
        if(this.state.newComment!=''){
            let newComment = {
                commentContent: this.state.newComment,
                userId: this.props.user._id
            }

            let newCard = this.state.card
            newCard.cardComments.push(newComment)
            callAddCommentCard(this.state.idBoard,this.state.idList,newCard)

        }else{
            //Alert comment must not be empty
        }

    };

    toggleDisplay = (labelButton) => {
        let previousHM = this.state.hiddenMembers
        let previousHL = this.state.hiddenLabels
        let previousDeadL = this.state.hiddenDeadline
        if(labelButton == 'labels'){
            this.setState({
                hiddenLabels: !previousHL,
                hiddenDeadline: true,
                hiddenMembers: true
            })
        }else if(labelButton == 'members'){
            this.setState({
                hiddenLabels: true,
                hiddenMembers: !previousHM,
                hiddenDeadline: true
            })
        }else if(labelButton == 'deadline'){
            this.setState({
                hiddenLabels: true,
                hiddenMembers: true,
                hiddenDeadline: !previousDeadL
            })
        }


    }

    addComponent = (labelButton) => {
        if(labelButton=='labels' && !this.state.hiddenLabels){
            return <CardOptions function="labels" card={this.state.card} idList={this.state.idList} idBoard={this.state.idBoard}/>
        }else if(labelButton == 'members' && !this.state.hiddenMembers){
            return <CardOptions function="members" card={this.state.card} idList={this.state.idList} idBoard={this.state.idBoard}/>
        }else if(labelButton == 'deadline' && !this.state.hiddenDeadline){
            return <CardOptions function="deadline" card={this.state.card} idList={this.state.idList} idBoard={this.state.idBoard}/>

        }
    }

    handleAddDescription = (event) => {
        event.preventDefault()
        let newCard  = this.state.card
        if(this.state.newDescription != ""){
            newCard.cardDescription = this.state.newDescription
            callEditCard(this.state.idBoard,this.state.idList,newCard)
            /*this.setState({
                card: newCard
            })*/

        }else{
            //Alert description must not be empty
        }
    }

    handleChangeStatus = (event) => {
        event.preventDefault()
        let newCard = this.state.card
        newCard.isArchived = !this.state.card.isArchived
        callEditCard(this.state.idBoard,this.state.idList,newCard)
        this.setState({
            card: newCard
        })
    }

    renderDeadLine(){
        if(this.state.card.cardDeadline){
            return <span><i className="ni ni-time-alarm"/>{this.state.card.cardDeadline}</span>
        }
    }

    unorarchive(){
        if(this.state.card.isArchived){
            return <li><button type="button" className="btn btn-secondary cardButtonEdit" onClick={this.handleChangeStatus}>Unarchived</button></li>
        }else{
            return <li><button type="button" className="btn btn-secondary cardButtonEdit" onClick={this.handleChangeStatus}>Archived</button></li>
        }
    }

    renderDeleteButton(){

           return <li><button type="button" className="btn btn-secondary cardButtonEdit" onClick={this.handleDeleteCard}> Delete </button></li>

    }

    handleDeleteCard = (event) => {
        event.preventDefault()
        callRemoveCard(this.state.idBoard,this.state.idList,this.state.card._id)
    }
    render(){
        return (
            <div className="modal fade modalCard" id={"card-modal" + this.state.card._id} tabIndex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true">
                <div className="modal-dialog modal- modal-dialog-centered modal-" role="document">
                    <div className="modal-content modalContentCard">

                        <div className="modal-header">
                            <Title id={'title'+this.state.card._id} onClick={this.titleToInput}>{this.state.card.cardTitle}</Title>

                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>

                        <div className="modal-body modalContentCard">
                            <div className="labelForCard">
                                <span><i className="ni ni-tag"/></span>
                                {this.state.cardLabels.map((label) => {
                                    return <span className="badge badge-pill badge-default" style={{background: label.labelColor}}>{label.labelName}</span>
                                })}
                            </div>

                            <div className={"deadLineDiv"}>
                                {this.renderDeadLine()}
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
                                                    onChange={(e) => this.setState({
                                                        newDescription: e.target.value
                                                    })}>{this.state.card.cardDescription}</textarea>
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
                                                    newComment: e.target.value
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
                                                {this.state.card.cardComments.map((comment) => {
                                                    return <div><span><i className="ni ni-chat-round"/>{"  " + comment.commentContent}</span></div>

                                                })
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </form>
                                <div id={'cardactivitydiv'}>
                                    <span> Activity </span>

                                </div>
                            </div>
                            <div className={'cardactiondiv'}>
                                <span> Action </span>
                                <ul className={'actionUl'}>
                                    {this.unorarchive()}
                                    {this.renderDeleteButton()}
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
    user: state.user,
    labels: state.labels
});

export default connect(mapStateToProps)(ModalEditCard);



