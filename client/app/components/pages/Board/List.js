import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Card from "./Card";
import {callEditList, callRemoveList} from "../../../actions/ListActions";
import ConfirmModal from "../../partials/ConfirmModal";
import { connect } from 'react-redux';
import {Title,Container,CardList} from "../Utils/Utils";
import {callCreateCard, callEditCard} from "../../../actions/CardActions";


export class List extends React.Component {
    constructor(props){
        super(props)
        this.createCard = this.createCard.bind(this)
        this.titleToInput = this.titleToInput.bind(this)
        this.inputToTitle = this.inputToTitle.bind(this);
        this.removeList = this.removeList.bind(this);
    }

    removeList = () => {
        callRemoveList(this.props.idBoard,this.props.list._id)
    }

    archiveList = () => {
        let idBoard = this.props.idBoard;
        let nlist = this.props.list;
        nlist.listArchived = true;
        //nlist.listCard.map((card) => {card.cardArchived = true; callEditCard(idBoard, nlist._id, card)}) Uncomment it when editCard done
        callEditList(idBoard, nlist);
    }

    updateListName = (newTitle) =>{
        let idBoard = this.props.board._id;
        let newList = this.props.list;
        newList.listTitle = newTitle;
        callEditList(idBoard, newList);
    }

    inputToTitle = (event) =>{
        event.preventDefault();
        const input = document.getElementById(this.props.list._id);
        this.updateListName(input.value);
        const title = document.createElement("div");
        title.innerHTML = input.value;
        title.id = this.props.list._id;
        title.onclick = this.titleToInput;
        input.parentNode.replaceChild(title, input);
    }

    titleToInput = (event) =>{
        event.preventDefault();
        const title = document.getElementById(this.props.list._id);
        const input = document.createElement("input");
        input.value = title.innerText;
        input.id = this.props.list._id;
        input.onblur = this.inputToTitle;
        input.className = "form-control w-100";
        title.parentNode.replaceChild(input, title);
        input.focus();
    }

    createCard = (event) => {
        event.preventDefault()

        let idBoard = this.props.board._id

        let idList = this.props.list._id
        callCreateCard(idBoard,idList)
    }


    render() {
        return (
            <Draggable draggableId={"listDragId"+this.props.list._id} index={this.props.index}>
                {(provided) => {
                    return (
                        <Container {...provided.draggableProps} ref={provided.innerRef}>
                        <ConfirmModal id={"confirmDeletemodal"+this.props.list._id} text={"Are you sure you want to delete the list "+this.props.list.listTitle+" ?"} confirmAction={this.removeList}/>
                        <ConfirmModal id={"confirmArchivemodal"+this.props.list._id} text={"Are you sure you want to archive the list "+this.props.list.listTitle+" ?"} confirmAction={this.archiveList}/>
                        <a className={"ni ni-fat-remove"} data-toggle="modal" data-target={"#"+"confirmDeletemodal"+this.props.list._id} style={{fontSize: "30px", position: "absolute", "right": "0px"}}></a>
                        <Title {...provided.dragHandleProps}>
                            <div id={this.props.list._id} onClick={this.titleToInput}>{this.props.list.listTitle}</div>
                        </Title>
                            <div style={{textAlign: "center"}}>{this.props.list.listCards.filter((card) => card.isArchived==false).count() + " cards"}
                                <div className="dropdown" style={{float:"right"}}>
                                    <button className="btn fas fa-ellipsis-v" type="button" id={"dropdownMenuButton"+this.props.list.listId} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item">Copy list</a>
                                        <a className="dropdown-item" href="#">Move list</a>
                                        <a className="dropdown-item" href="#">Archive all cards</a>
                                        <a className="dropdown-item" data-toggle="modal" data-target={"#"+"confirmArchivemodal"+this.props.list._id}>Archive list</a>
                                    </div>
                                </div>
                            </div>
                            <Droppable droppableId={"listId"+this.props.list._id} type={"card"}>
                                {(provided) => (
                                    <CardList ref={provided.innerRef} {...provided.droppableProps}>
                                        {this.props.cards.map((card, index) => {
                                            if(!card.isArchived){
                                               return <Card key={card._id} card={card}
                                                      index={index} board={this.props.board} idList={this.props.list._id}/>
                                        }
                                        })}
                                        {provided.placeholder}
                                    </CardList>
                                )
                                }

                            </Droppable>
                            <button className="btn btn-icon btn-3 btn-primary" type="button" onClick={this.createCard}>
                                <span className="btn-inner--icon"><i className="ni ni-fat-add"/></span>
                                <span className="btn-inner--text">Add card</span>

                            </button>

                        </Container>
                    )}}
            </Draggable>
        )

    }
}

const mapStateToProps = state => ({
    user: state.user,
    labels: state.labels
})

export default connect(mapStateToProps)(List);