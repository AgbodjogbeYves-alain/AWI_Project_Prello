import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {ContainerC} from "../Utils/Utils";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

export default class Card extends Component {

    render() {
        return (
            <Draggable draggableId={this.props.card._id} index={this.props.index}>
                {(provided) =>
                    <ContainerC {...provided.draggableProps}
                               {...provided.dragHandleProps}
                               ref={provided.innerRef}
                    >
                        {this.props.card._id}
                    </ContainerC>}
            </Draggable>

        )
    }
}