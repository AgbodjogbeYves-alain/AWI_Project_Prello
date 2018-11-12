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
            //cardLabels: this.props.card.cardLabels,
            boardLabels: this.props.labels.filter((label) => label.labelBoard == this.props.idBoard ),
            cardDeadline: this.props.card.cardDeadline,
            newLabelName: "",
            newLabelColor: "",
        };

        this.handleAddDeadline = this.handleAddDeadline.bind(this)
        this.handleAddLabel = this.handleAddLabel.bind(this)
        this.handleAffectLabelToCard = this.handleAffectLabelToCard.bind(this)
    }


    handleAddDeadline = (event) => {
        event.preventDefault();
        let newCard = this.state.card
        newCard.cardDeadline = this.state.cardDeadline
        console.log(newCard.cardDeadline)
        callEditCard(this.state.idBoard,this.state.idList,newCard)
    }

    handleAddLabel = (event) =>{
        event.preventDefault()
        let newLabel = {
            labelColor: this.state.newLabelColor,
            labelName: this.state.newLabelName,
            labelBoard: this.state.idBoard
        }
        callCreateLabel(this.state.idBoard,newLabel)
        let newLabelList = this.state.boardLabels
        newLabelList.push(newLabel)
        this.setState({
            boardLabels: newLabelList
        })

    }



    handleAffectLabelToCard = (idLabel) => {
        let newLabelList
        if(this.state.card.cardLabels.includes(idLabel)) {
            newLabelList = this.state.card.cardLabels.filter((label) => label._id != idLabel)
        }else{
            newLabelList = this.state.card.cardLabels
            newLabelList.push(idLabel)

        }

        let newCard = this.state.card
        newCard.cardLabels = newLabelList

        console.log(newLabelList)
        callEditCard(this.state.idBoard,this.state.idList,newCard)
        this.setState({
            card: newCard
        })

    }

    render(){
        if(this.props.function == 'labels'){
            return (
                    <div>
                        <div className="card card-stats mb-4 mb-lg-0 cardForOptions">
                            <div className="card-body">
                                <div className={"divLabelBoard"}>
                                <h5> Label list</h5>
                                {
                                    this.state.boardLabels.map((label)=>{
                                        return <button className={"btn btn-secondary buttonLabel"} style={{background: label.labelColor}} onClick={(e) => { e.preventDefault();this.handleAffectLabelToCard(label._id)}}>{label.labelName}</button>
                                     })
                                }
                                </div>
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
                                       value={this.state.cardDeadline} onChange={(e)=>this.state.cardDeadline=e.target.value}
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



