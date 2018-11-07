import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components'
import Card from "./Card";
import {callEditList, callRemoveList, editList} from "../../../actions/ListActions";
import ConfirmModal from "../../partials/ConfirmModal";
import { connect } from 'react-redux';
import {callEditBoard} from "../../../actions/BoardActions";
import asteroid from '../../../common/asteroid';

const Container = styled.div`
  background-color: #d0d0d0;
  border-radius: 5px;
  box-shadow: 0px 0px 3px 1px #0000005c;
  display: flex;
  flex-direction: column;
  min-width: 250px;
  width: 15vw;
  margin-left: 7px;
  margin-right: 7px;
  margin-bottom: 20px;
  position: relative;
  box-sizing: border-box;
`;

const Title = styled.h3`
  padding: 8px;
`;
const CardList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? "lightgrey" : "inherit"};
  flex-grow: 1;
  min-height: 100px;
  
`;


export class List extends React.Component {
    constructor(props){
        super(props)
        this.createCard = this.createCard.bind(this)
        this.titleToInput = this.titleToInput.bind(this)
        this.inputToTitle = this.inputToTitle.bind(this);
        this.removeList = this.removeList.bind(this);
    }

    removeList = () => {
        callRemoveList(this.props.list._id)
        let idBoard = this.props.idBoard;
        let board = this.props.boards.filter((board) => board._id == idBoard )[0];
        let newBoardList = board.boardLists.filter((list) => list._id != this.props.list._id)
        board.boardLists = newBoardList
        callEditBoard(board)
    }

    updateListName = (newtitle) =>{
        let idBoard = this.props.idBoard;
        let board = this.props.boards.filter((board) => board._id == idBoard )[0];
        let newList = this.props.list;
        newList.listTitle = newtitle;
        callEditList(idBoard, newList);
        let newBoardList = board.boardLists.map((list) => {
            if(list._id == newList._id){
                return newList
            }else{
                return list
            }
        })
        board.boardLists = newBoardList;
        callEditBoard(board);
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

        let boardofThisList = this.props.boards.filter((board) => board._id == idBoard )[0]

        let newCard = {_id:'',cardTitle: "new card"}

        let newListCard = this.props.list.listCard
        newListCard.push(newCard)

        let newList = this.props.list
        newList.listCard = newListCard

        let newBoardList = boardofThisList.boardLists.map((list) => {
            if(list._id == newList._id){
                return newList
            }else{
                return list
            }
        })

        boardofThisList.boardLists = newBoardList

        callEditBoard(boardofThisList)
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