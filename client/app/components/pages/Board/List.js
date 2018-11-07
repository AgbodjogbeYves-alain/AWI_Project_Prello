import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components'
import Card from "./Card";
import {callEditList} from "../../../actions/ListActions";
import { connect } from 'react-redux';
import {callEditBoard} from "../../../actions/BoardActions";

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


class List extends React.Component {
    constructor(props){
        super(props)
        this.createCard = this.createCard.bind(this)
        this.sayclick = this.sayclick.bind(this)
    }

    sayclick = (event) =>{
        console.log("Joris")
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

        //console.log(this.props.boards.filter((board) => board._id == idBoard )[0])
    }
    render() {
        return (
            <Draggable draggableId={"listDragId"+this.props.list._id} index={this.props.index}>
                {(provided) => {
                    return (
                        <Container {...provided.draggableProps} ref={provided.innerRef}>
                            <Title {...provided.dragHandleProps}> Drag Here </Title>
                            <Title onClick={this.sayclick}>{this.props.list.listTitle}</Title>
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