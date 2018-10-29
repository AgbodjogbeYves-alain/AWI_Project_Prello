import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled, { css } from 'styled-components'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

let grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

export default class Cards2 extends Component {


    render() {
        return (
            <Draggable draggableId={this.props.tasks.id} index={this.props.index}>
                {(provided,snapshot) =>
                    <div {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                         style={getItemStyle(
                             snapshot.isDragging,
                             provided.draggableProps.style
                         )}>
                        {this.props.tasks.content}
                    </div>}
            </Draggable>

        )
    }
}