import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components'
import Card from "./Card";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: darkgrey;
  border-radius: 2px;
  width: 25%;
  display: flex;
  flex-direction: column;
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
                            <Title {...provided.dragHandleProps}>{this.props.list.listTitle}</Title>
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