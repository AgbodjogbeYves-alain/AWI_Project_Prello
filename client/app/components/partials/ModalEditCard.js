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
            cardComments: this.props.card.cardComment
        };

        this.titleToInput = this.titleToInput.bind(this)
        this.inputToTitle = this.inputToTitle.bind(this);
        this.handleEditCard = this.handleEditCard.bind(this)
        this.handleAddComment = this.handleAddComment.bind(this)
        this.handleChangeDescription = this.handleChangeDescription.bind(this)
        this.handleWriteComment = this.handleWriteComment.bind(this)
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


    render(){
        return (
            <div className="modal fade modalCard" id={"card-modal" + this.state.card._id} tabIndex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true" style={{width:1700+'px'}}>
                <div className="modal-dialog modal- modal-dialog-centered modal-" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <Title id={'title'+this.props.card._id} onClick={this.titleToInput}>{this.props.card.cardTitle}</Title>

                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <form role="form" onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group mb-3">
                                    <div className="input-group input-group-alternative">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <div className="input-group input-group-alternative">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"/>
                                        </div>
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
                                    <div className="input-group input-group-alternative">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"/>
                                        </div>
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
                            <div className={'cardactiondiv'}>
                                <span> Action </span>
                                <ul className={'actionUl'}>
                                    <li><button type="button" className="btn btn-secondary cardButtonEdit">Archiver</button></li>
                                    <li>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-secondary cardButtonEdit dropdown-toggle">Membres</button>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a className="dropdown-item" href="#">Action</a>
                                                <a className="dropdown-item" href="#">Another action</a>
                                                <a className="dropdown-item" href="#">Something else here</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-secondary cardButtonEdit">Tags</button>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a className="dropdown-item" href="#">Action</a>
                                                <a className="dropdown-item" href="#">Another action</a>
                                                <a className="dropdown-item" href="#">Something else here</a>
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
                                            <button type="button" className="btn btn-secondary cardButtonEdit">Deadline</button>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <input className={"dropdown-item"} type="date" id="start" name="trip-start"
                                                       value="2018-07-22"
                                                       min="2018-01-01" max="2018-12-31">
                                                </input>
                                            </div>

                                        </div>
                                    </li>

                                </ul>

                            </div>
                            <div id={'cardactivitydiv'}>
                                <span> Activité </span>

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



