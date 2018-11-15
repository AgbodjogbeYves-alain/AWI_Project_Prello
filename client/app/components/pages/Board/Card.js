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

    getCompletedPourcent(){
        let checklists = this.props.card.cardChecklists;
        
        let totalItems = checklists.map((checklist) => checklist.checklistItems.length)
        .reduce((acc, val) => acc + val)

        if(totalItems == 0) return 100;
        
        let numCheckedItems = checklists.map((checklist) => checklist.checklistItems.filter((i) => i.itemChecked).length)
        .reduce((acc, val) => acc + val)
        
        return 100*numCheckedItems/totalItems;
    }

    hasChecklist(){
        return this.props.card.cardChecklists.length !== 0;
    }

    renderLabels(){
        let cardLabels = this.props.labels.filter((label) => this.props.card.cardLabels.includes(label._id) );
        return cardLabels.map((label) => {
            return <span className="badge badge-pill badge-default" style={{background: label.labelColor}}>{label.labelName}</span>
        })
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

                        {this.hasChecklist() ?
                            <div className="progress card-progress">
                                <div className="progress-bar bg-primary" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" 
                                    style={{"width": this.getCompletedPourcent() + "%"}}>
                                </div>
                            </div> : ""
                        }

                        <div className={"cardLabelsDiv"}>
                            {this.renderLabels()}
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