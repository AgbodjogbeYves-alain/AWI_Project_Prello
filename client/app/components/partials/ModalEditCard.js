import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import asteroid from '../../common/asteroid';
import {Title} from "../pages/Utils/Utils";

class ModalEditCard extends Component {


    constructor(props) {
        super(props);
        this.state = {
            card: this.props.card,
            cardTitle: this.props.card.cardTitle,
            cardComments: this.props.card.cardComment,
            cardDeadline: this.props.card.cardDeadline,
            cardTags: this.props.card.cardTags,
            newTagTitle: "",
            newTagColor: ""
        };

        this.titleToInput = this.titleToInput.bind(this)
        this.inputToTitle = this.inputToTitle.bind(this);
        this.handleEditCard = this.handleEditCard.bind(this)
        this.handleAddComment = this.handleAddComment.bind(this)
        this.handleChangeDescription = this.handleChangeDescription.bind(this)
        this.handleWriteComment = this.handleWriteComment.bind(this)
        this.handleAddDeadline = this.handleAddDeadline.bind(this)
    }

    handleEditCard = () => {
        console.log("Hello 2")
        console.log(this.state.cardTitle)
    }

    inputToTitle = (event) =>{
        event.preventDefault();
        const input = document.getElementById('title'+this.props.card._id);
        this.updateCardName(input.value);
        const title = document.createElement("h3");
        title.innerHTML = input.value;
        title.style= "padding:8px";
        title.id = 'title'+this.props.card._id;
        title.onclick = this.titleToInput;
        input.parentNode.replaceChild(title, input);
    }

    titleToInput = (event) =>{
        event.preventDefault();
        const title = document.getElementById('title'+this.props.card._id);
        const input = document.createElement("input");
        input.value = title.innerText;
        input.style = "font-size: 40px;padding: 8px"
        input.id = 'title'+this.props.card._id;
        input.onblur = this.inputToTitle;
        input.className = "form-control w-100";
        title.parentNode.replaceChild(input, title);
        input.focus();
    }


    updateCardName(value) {
        this.setState({cardTitle: value})
    }

    handleChangeDescription = (event) => {
        event.preventDefault();
        this.setState({
            cardDescription: event.target.value
        })
    };

    handleAddComment = (event) => {
        event.preventDefault();
        console.log(this.state.cardComments)
    };

    handleWriteComment = (event) => {
        event.preventDefault()
        this.setState({
            cardComment: event.target.value
        })
    }


    handleAddDeadline = (event) => {
        event.preventDefault();
        console.log(this.state.cardDeadline)
    }

    render(){
        return (
            <div className="modal fade modalCard" id={"card-modal" + this.state.card._id} tabIndex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true" style={{width:1700+'px'}}>
                <div className="modal-dialog modal- modal-dialog-centered modal-" role="document">
                    <div className="modal-content modalContentCard">

                        <div className="modal-header">
                            <Title id={'title'+this.props.card._id} onClick={this.titleToInput}>{this.props.card.cardTitle}</Title>

                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>

                        <div className="modal-body modalContentCard">
                            <div className="formCardModal">
                            <form role="form" onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group mb-3">
                                    <div>
                                        <div id={"descriptionDiv"}>
                                            <span> Description </span>

                                            <textarea
                                                className="form-control"
                                                placeholder="Add description"
                                                type="text"
                                                onChange={this.handleChangeDescription}/>
                                        </div>

                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                        <div id={"commentDiv"}>
                                            <span> Add comment </span>

                                            <textarea
                                                className="form-control"
                                                placeholder="Add Comment"
                                                type="text"
                                                onChange={this.handleWriteComment}/>
                                            <button type="button" className="btn btn-secondary" onClick={this.handleAddComment}>Add</button>
                                        </div>
                                </div>
                                <div className="form-group mb-3">
                                    <div className="input-group input-group-alternative">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"/>
                                        </div>
                                        <div id={"listComment"}>
                                            <span> Comment list </span>
                                        </div>

                                    </div>
                                </div>
                            </form>
                                <div id={'cardactivitydiv'}>
                                    <span> Activité </span>

                                </div>
                        </div>
                            <div className={'cardactiondiv'}>
                                <span> Action </span>
                                <ul className={'actionUl'}>
                                    <li><button type="button" className="btn btn-secondary cardButtonEdit">Archiver</button></li>
                                    <li>
                                        <div className="dropdown">
                                            <button className="btn btn-secondary cardButtonEdit dropdown-toggle" type="button"
                                                    id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false">
                                                Members
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a className="dropdown-item" href="#">Action</a>
                                                <a className="dropdown-item" href="#">Another action</a>
                                                <a className="dropdown-item" href="#">Something else here</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dropdown">
                                            <button className="btn btn-secondary cardButtonEdit dropdown-toggle" type="button"
                                                    id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false">
                                                Tags
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a className="dropdown-item" href="#">Action</a>
                                                <a className="dropdown-item" href="#">Another action</a>
                                                <a className="dropdown-item" href="#">Something else here</a>
                                                <a className="dropdown-item" href="#">
                                                    <input type="text" placeholder={"Enter new tag title here"}
                                                          onChange={(e)=> {
                                                              this.setState({newTagTitle: e.target.value})
                                                          }}
                                                    >
                                                    </input>
                                                    <input type="color"
                                                           onChange={(e)=> {
                                                               this.setState({newTagColor: e.target.value})
                                                           }}
                                                    >
                                                    </input>
                                                </a>
                                                <a className="dropdown-item" href="#"><button type="button" className="btn btn-secondary" onClick={this.handleAddDeadline}>Add</button></a>
                                            </div>
                                        </div>

                                    </li>
                                    <li>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-secondary cardButtonEdit">CheckList</button>

                                        </div>
                                    </li>

                                    <li>
                                        <div className="dropdown">
                                            <button className="btn btn-secondary cardButtonEdit dropdown-toggle" type="button"
                                                    id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false">
                                                Deadline
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                               <a className={"dropdown-item"} href="#">
                                                   <input type="date" id="start" name="trip-start"
                                                       onChange={(e)=> this.setState({cardDeadline: e.target.value})}
                                                          value={this.state.cardDeadline}
                                                   >
                                                    </input>
                                                   <button type="button" className="btn btn-secondary" onClick={this.handleAddDeadline}>Add</button>
                                               </a>
                                            </div>

                                        </div>
                                    </li>

                                </ul>

                            </div>

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-link" data-dismiss="modal">Close</button>
                                <button
                                    className="btn btn-primary  ml-auto"
                                    onClick={() => this.handleEditCard()}>
                                    Save
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(withRouter(ModalEditCard));



