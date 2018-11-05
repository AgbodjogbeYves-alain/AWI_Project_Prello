import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

export default class Card extends Component {


    render() {
        return (
            <Draggable draggableId={this.props.card.cardId} index={this.props.index}>
                {(provided) =>
                    <Container {...provided.draggableProps}
                               {...provided.dragHandleProps}
                               ref={provided.innerRef}
                    >
                        {this.props.card.cardTitle}
                    </Container>}
            </Draggable>

        )
    }
}