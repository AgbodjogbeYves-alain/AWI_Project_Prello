import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { GithubPicker } from 'react-color';
import asteroid from '../../common/asteroid';
import {Title} from "../pages/Utils/Utils";
import {callEditBoard} from "../../actions/BoardActions";
import {callEditCard} from "../../actions/CardActions";

class CardOptions extends Component {


    constructor(props) {
        super(props);
        this.state = {
            idList: this.props.idList,
            idBoard: this.props.idBoard,
            card: this.props.card,
            function: this.props.function,
            cardTags: this.props.card.cardTags,
            cardDeadline: this.props.card.cardDeadline,
            newTagTitle: "",
            newTagColor: "",
        };

        this.handleAddDeadline = this.handleAddDeadline.bind(this)
        this.handleAddTag = this.handleAddTag.bind(this)
    }


    handleAddDeadline = (event) => {
        event.preventDefault();
        console.log(this.state.cardDeadline)
        let newCard = this.state.card
        newCard.cardDeadline = event.target.value
        callEditCard(this.state.idBoard,this.state.idList,newCard)
    }

    handleAddTag = (event) =>{
        event.preventDefault()
        let newTag = {
            tagColor: this.state.newTagColor,
            tagTitle: this.state.newTagTitle
        }
        console.log(newTag)
        let newCard = this.state.card
        newCard.cardLabels.push(newTag)
        callEditBoard(this.state.idBoard,this.state.idList,newCard)
    }

    render(){
        if(this.props.function == 'labels'){
            return (
                    <div>
                        <div className="card card-stats mb-4 mb-lg-0 cardForOptions">
                            <div className="card-body">
                                <h5> Label list</h5>

                                <h5>Add label</h5>
                                <input type="text" className={'form-control form-control-alternantive'} placeholder={"Enter new tag title here"}
                                       onChange={(e)=> {
                                           this.setState({newTagTitle: e.target.value})
                                       }}
                                >
                                </input>

                                <GithubPicker
                                    onChange={(color,e)=> {
                                        e.preventDefault();
                                        this.setState({newTagColor: color.hex})
                                        console.log(color.hex)
                                    }}
                                >
                                </GithubPicker>
                                 <button type="button" className="btn btn-success cardButtonEditLabel" onClick={this.handleAddTag}>Add</button>
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
    user: state.user
});

export default connect(mapStateToProps)(CardOptions);



