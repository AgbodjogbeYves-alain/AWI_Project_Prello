import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {ContainerC} from "../Utils/Utils";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import ModalEditCard from "../../partials/ModalEditCard";

class Card extends Component {
    constructor(props) {
        super(props)
        this.state = {
            boardLabels: this.props.labels.map((label) => {
                this.props.boardLabels.map((label2) => {
                    if (label2 == label._id) {
                        return label
                    }
                })
            }),

            cardLabels: this.props.labels.map((label) => {
                this.props.card.cardLabels.map((label2) => {
                    if (label2 == label._id) {
                        return label
                    }
                })

            })
        }
    }

    render() {
        return (
            <div>
            <Draggable draggableId={this.props.card._id} index={this.props.index}>
                {(provided) =>
                    <ContainerC {...provided.draggableProps}
                               {...provided.dragHandleProps}
                               ref={provided.innerRef}
                                data-toggle="modal" data-target={"#card-modal"+this.props.card._id}>
                        {this.props.card.cardTitle}
                    </ContainerC>}
            </Draggable>
                {console.log(this.state.boardLabels)}
            <ModalEditCard boardLabels={this.state.boardLabels} cardLabels={this.state.cardLabels} card={this.props.card} idBoard={this.props.board._id} idList={this.props.idList}/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    labels: state.labels
});

export default connect(mapStateToProps)(Card);