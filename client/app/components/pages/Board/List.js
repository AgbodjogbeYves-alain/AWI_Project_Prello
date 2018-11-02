import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components'
import Card from "./Card";

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


export default class List extends React.Component {
    render() {
        return (
            <Draggable draggableId={"listDragId"+this.props.list.listId} index={this.props.index}>
                {(provided) => {
                    return (
                        <Container {...provided.draggableProps} ref={provided.innerRef}>
                        <div>
                            <Title {...provided.dragHandleProps}>{this.props.list.listTitle}</Title>
                            <div className="dropdown" style={{float:"right"}}>
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="glyphicon glyphicon-option-vertical"></span>
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" href="#">Edit list name</a>
                                    <a className="dropdown-item" href="#">Add a card</a>
                                    <a className="dropdown-item" href="#">Copy list</a>
                                    <a className="dropdown-item" href="#">Move list</a>
                                    <a className="dropdown-item" href="#">Follow</a>
                                    <a className="dropdown-item" href="#">Archive all cards</a>
                                    <a className="dropdown-item" href="#">Archive list</a>
                                </div>
                            </div>
                        </div>
                            <Droppable droppableId={"listId"+this.props.list.listId} type={"card"}>
                                {(provided) => (
                                    <CardList ref={provided.innerRef} {...provided.droppableProps}>
                                        {this.props.cards.map((card, index) => <Card key={card.cardId} card={card}
                                                                                     index={index}/>)}
                                        {provided.placeholder}
                                    </CardList>
                                )
                                }

                            </Droppable>
                        </Container>
                    )}}
            </Draggable>
        )

    }
}