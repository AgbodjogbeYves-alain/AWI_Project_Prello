import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled, { css } from 'styled-components'
import Cards2 from "./Card2";
import initialData from './initial-data';
import {DragSourceSpec as isDragging} from "react-dnd";

const Container = styled.div`
   margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  width: 220px;
`;

const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? "skyblue" : "white")};
  flex-grow: 1;
  min-height: 100px;
`;

export default class List extends React.Component {
    render() {
        return (
            <Container>
                <Title>{this.props.column.title}</Title>
                <Droppable droppableId={this.props.column.id}>
                    {(provided) => (
                        <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                            {this.props.tasks.map((task,index) => <Cards2 key={task.id} tasks={task} index={index}/>)}
                            {provided.placeholder}
                        </TaskList>
                    )
                    }

                </Droppable>
        </Container>
        )

    }
}