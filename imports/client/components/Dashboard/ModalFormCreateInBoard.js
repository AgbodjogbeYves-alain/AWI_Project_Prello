import React, { Component } from "react";
import ReactModal from 'react-modal';



export default class ModalFormCreateInBoard extends Component {

    constructor (props) {
        super(props);
        this.state = {
            showModal: false,
            privacy: '',
            boardName: ''
        };
    }

    handleBNChange (event) {
        this.setState({ boardName: event.target.value})
    }


    handlePrivacyChange (event) {
        this.setState({ privacy: event.target.value})
    }


    handleSubmit = (event) => {
        event.preventDefault();
        let boardName = this.boardName.value;
        console.log(boardName)
        Meteor.call('createBoard',{boardName},(error, result) => {

            console.log(boardName)
            console.log(result)
            console.log(error)
        })

    }

    render(){
        return(
            <ReactModal
                isOpen={this.state.showModal}
                contentLabel="Minimal Modal Example"
            >
            <form onSubmit={this.handleSubmit}>
                <input className="form-control" placeholder="Board name" type="text" value={this.state.boardName} onChange={this.handleBNChange}/>
                <div className="selectPrivacy">
                    <select>
                        <option value={this.state.privacy} onChange={this.handlePrivacyChange}>Private</option>
                        <option value={this.state.privacy} onChange={this.handlePrivacyChange}>Public</option>
                    </select>
                </div>
            </form>
            <button onClick={this.handleSubmit}>Create board</button>

            <button onClick={this.handleCloseModal}>Close Modal</button>

            </ReactModal>
         )
    }

}