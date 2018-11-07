import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Card from "./Card";
import {callEditList, callRemoveList, editList} from "../../../actions/ListActions";
import ConfirmModal from "../../partials/ConfirmModal";
import { connect } from 'react-redux';
import {Title,Container,CardList} from "../Utils/Utils";
import {callCreateCard} from "../../../actions/CardActions";


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

    updateListName = (newTitle) =>{
        let idBoard = this.props.idBoard;
        let newList = this.props.list;
        newList.listTitle = newTitle;
        callEditList(idBoard, newList);
    }

    inputToTitle = (event) =>{
        event.preventDefault();
        const input = document.getElementById(this.props.list._id);
        this.updateListName(input.value);
        const title = document.createElement("h3");
        title.innerHTML = input.value;
        title.style= "padding:8px";
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
        input.onblur = this.inputToTitle
        title.parentNode.replaceChild(input, title);
    }

    createCard = (event) => {
        event.preventDefault()

        let idBoard = this.props.idBoard
        let idList = this.props.list._id
        callCreateCard(idBoard,idList)
    }


    render() {
        return (
            <Draggable draggableId={"listDragId"+this.props.list._id} index={this.props.index}>
                {(provided) => {
                    return (
                        <Container {...provided.draggableProps} ref={provided.innerRef}>
                        <ConfirmModal id={"confirmmodal"+this.props.list._id} text={"Are you sure you want to delete the list "+this.props.list.listTitle+" ?"} confirmAction={this.removeList}/>
                        <a className={"ni ni-fat-remove"} data-toggle="modal" data-target={"#"+"confirmmodal"+this.props.list._id} style={{fontSize: "30px", position: "absolute", "right": "0px"}}></a>
                        <Title {...provided.dragHandleProps}>Drag Here</Title>
                            <Title id={this.props.list._id} onClick={this.titleToInput}>{this.props.list.listTitle}</Title>
                            <div>{this.props.list.listCard.length + " cards"}</div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id={"dropdownMenuButton"+this.props.list.listId} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{float:"right"}}>
                                    <span className="glyphicon glyphicon-option-vertical"></span>
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" href="#">Copy list</a>
                                    <a className="dropdown-item" href="#">Move list</a>
                                    <a className="dropdown-item" href="#">Follow</a>
                                    <a className="dropdown-item" href="#">Archive all cards</a>
                                    <a className="dropdown-item" href="#">Archive list</a>
                                </div>
                            </div>
                            <Droppable droppableId={"listId"+this.props.list._id} type={"card"}>
                                {(provided) => (
                                    <CardList ref={provided.innerRef} {...provided.droppableProps}>
                                        {this.props.cards.map((card, index) => <Card key={card._id} card={card}
                                                                                     index={index}/>)}
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
    boards: state.boards
})

export default connect(mapStateToProps)(List);