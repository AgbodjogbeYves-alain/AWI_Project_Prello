import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Card from "./Card";
import {callEditList} from "../../../actions/ListActions";
import { connect } from 'react-redux';
import {Title,Container,CardList} from "../Utils/Utils";
import {callCreateCard} from "../../../actions/CardActions";

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
        let idList = this.props.list._id
        callCreateCard(idBoard,idList)


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