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
            board: this.props.board,
            cardLabels: this.props.labels.filter((label) => this.props.card.cardLabels.includes(label._id) ),

            //cardLabels: [],
            //boardLabels: []
        }
    }


    /*componentDidMount(){
        let boardLabelsT = []
        this.props.labels.forEach((label) => {
            this.props.board.boardLabels.forEach((idLabel) => {
                if(label._id==idLabel){
                    boardLabelsT.push(label)
                }
            })
        })

        let cardLabelsT = []
        this.props.labels.forEach((label) => {
            this.props.card.cardLabels.forEach((idLabel) => {
                if(label._id==idLabel){
                    cardLabelsT.push(label)
                }
            })
        })

        this.setState({
            boardLabels: boardLabelsT,
            cardLabels: cardLabelsT
        })
    }*/
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
                        <div className={"cardLabelsDiv"}>
                            {this.state.cardLabels.map((label) => {
                                return <span className="badge badge-pill badge-default" style={{background: label.labelColor}}>{label.labelName}</span>
                            })}
                        </div>
                    </ContainerC>}
            </Draggable>
            <ModalEditCard card={this.props.card} idBoard={this.state.board._id} idList={this.props.idList}/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    labels: state.labels
});

export default connect(mapStateToProps)(Card);