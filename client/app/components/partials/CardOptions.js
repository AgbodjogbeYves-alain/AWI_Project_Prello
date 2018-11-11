import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { GithubPicker } from 'react-color';
import asteroid from '../../common/asteroid';
import {Title} from "../pages/Utils/Utils";
import {callEditBoard} from "../../actions/BoardActions";
import {callEditCard} from "../../actions/CardActions";
import {callCreateLabel, callEditLabels} from "../../actions/LabelActions";

class CardOptions extends Component {


    constructor(props) {
        super(props);
        this.state = {
            idList: this.props.idList,
            idBoard: this.props.idBoard,
            card: this.props.card,
            function: this.props.function,
            cardLabels: this.props.card.cardLabels,
            cardDeadline: this.props.card.cardDeadline,
            newLabelNamee: "",
            newLabelColor: "",
        };

        this.handleAddDeadline = this.handleAddDeadline.bind(this)
        this.handleAddLabel = this.handleAddLabel.bind(this)
    }


    handleAddDeadline = (event) => {
        event.preventDefault();
        console.log(this.state.cardDeadline)
        let newCard = this.state.card
        newCard.cardDeadline = event.target.value
        callEditCard(this.state.idBoard,this.state.idList,newCard)
    }

    handleAddLabel = (event) =>{
        event.preventDefault()
        let newLabel = {
            labelColor: this.state.newLabelColor,
            labelName: this.state.newLabelName
        }
        console.log(newLabel)
        callCreateLabel(this.state.idBoard,newLabel)
    }

    /*handleAffectLabelToCard = (idLabel) => {
        event.preventDefault()
        callEditCardLabels(this.state.idBoard,this.state.idList,this.state.card._id,idLabel)

    }*/
    render(){
        if(this.props.function == 'labels'){
            return (
                    <div>
                        <div className="card card-stats mb-4 mb-lg-0 cardForOptions">
                            <div className="card-body">
                                <h5> Label list</h5>
                                <select multiple>
                                    {console.log(this.props.boardLabels)}
                                    {
                                        this.props.boardLabels.forEach((label)=>{
                                        return <option value={label._id}><input disabled>{label.labelName}</input></option>
                                         })
                                    }
                                </select>

                                <h5>Add label</h5>
                                <input type="text" className={'form-control form-control-alternantive'} placeholder={"Enter new Label title here"}
                                       onChange={(e)=> {
                                           this.setState({newLabelName: e.target.value})
                                       }}
                                >
                                </input>

                                <GithubPicker
                                    onChange={(color,e)=> {
                                        e.preventDefault();
                                        this.setState({newLabelColor: color.hex})
                                        console.log(color.hex)
                                    }}
                                >
                                </GithubPicker>
                                 <button type="button" className="btn btn-success cardButtonEditLabel" onClick={this.handleAddLabel}>Add</button>
                            </div>
                        </div>
                    </div>
            )


            ;
        }else if(this.props.function == 'members'){
            return (
                    <div>

                        <div className="card card-stats mb-4 mb-lg-0 cardForOptions">
                            <div className="card-body">

                            </div>
                        </div>



                </div>
            );
        }else if(this.props.function == 'deadline'){
            return (

                    <div>

                        <div className="card card-stats mb-4 mb-lg-0 cardForOptions">
                            <div className="card-body">
                                <input type="date" id="start" name="trip-start"
                                       value={this.state.cardDeadline}
                                >
                                </input>
                                <button type="button" className="btn btn-success cardButtonEditDeadline" onClick={this.handleAddDeadline}>Add</button>
                            </div>
                        </div>


                    </div>
            );
        }
    }


}

const mapStateToProps = state => ({
    user: state.user,
    labels: state.labels

});

export default connect(mapStateToProps)(CardOptions);



