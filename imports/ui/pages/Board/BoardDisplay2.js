import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';
import List from './List2'
import initialData from './initial-data';
import styled from "styled-components";


const Container = styled.div`
  display: flex;
`;

export default class BoardDisplay2 extends React.Component {
    state = initialData;


    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];

        if(start === finish){
            ///////////////////////////////////////////////
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newStart = {
                ...start,
                taskIds: newTaskIds
            };


            ///////////////////////////////////////////////
            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newStart.id]: newStart,
                },
            };

            this.setState(newState)
        }else {

            //Move from a list to another
            const startTaskIds = Array.from(start.taskIds)
            startTaskIds.splice(source.index, 1);
            const newStart = {
                ...start,
                taskIds: startTaskIds,

            }

            const finishedTaskIds = Array.from(finish.taskIds)
            finishedTaskIds.splice(destination.index, 0, draggableId);
            const newFinish = {
                ...finish,
                taskIds: finishedTaskIds
            };

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newStart.id]: newStart,
                    [newFinish.id]: newFinish,
                },
            };

            this.setState(newState)


        }
    };

    render() {

        return (
    <Container>
            <DragDropContext onDragEnd={this.onDragEnd}>
                {this.state.columnOrder.map(columnId => {
                    const column = this.state.columns[columnId];
                    const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
                    return <List key={column.id} column={column} tasks={tasks}/>;
                })}


            </DragDropContext>
    </Container>
        )
    }
}