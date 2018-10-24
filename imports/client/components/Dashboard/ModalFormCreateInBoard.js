import React, { Component } from "react";
import ReactModal from 'react-modal';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";



export default class ModalFormCreateInBoard extends Component {

    constructor (props) {
        super(props);
        this.state = {
            privacy: '',
            boardName: ''
        };

        this.handleBNChange = this.handleBNChange.bind(this);
        this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleBNChange (event) {
        this.setState({ boardName: event.target.value});
    }

    handlePrivacyChange (event) {
        this.setState({ privacy: event.target.value});
    }

    handleSubmit (event) {
        let boardName = this.state.boardName;
        let privacy = this.state.privacy;
        Meteor.call('createBoard',{boardName,privacy},(error, result) => {
            if(error){

            }else{
                //BrowserRouter.push('/board/')
                console.log(result);

            }
            console.log(boardName);
            console.log(privacy);

        })

    }



    render(){
        return(
            <ReactModal
                isOpen={this.props.showModal}
                contentLabel="Minimal Modal Example"
                className="card-body px-lg-5 py-lg-5">

            <div className="modal-body">
            <form onSubmit={this.handleSubmit}>
                <input className="form-control" placeholder="Board name" type="text" value={this.state.boardName} onChange={this.handleBNChange}/>

                <select className="form-control" value={this.state.privacy} onChange={this.handlePrivacyChange}>
                    <option value="0">Public</option>
                    <option value="1">Private</option>
                </select>

            </form>
            </div>
            <button onClick={this.handleSubmit}>Create board</button>

            <button onClick={this.handleCloseModal}>Close Modal</button>

            </ReactModal>
         )
    }
}