import React, { Component } from "react";
import {Route, withRouter} from 'react-router-dom'
import asteroid from "../../../common/asteroid";



class ModalFormCreateInBoard extends Component {

    constructor (props) {
        super(props);
        this.state = {
            privacy: 0,
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
        event.preventDefault();

        let boardName = this.state.boardName;
        let privacy = this.state.privacy;


        asteroid.call('createBoard',{boardName,privacy})
            .then(result => {
                this.props.history.push('/board/'+result);
            }).catch(error => {
                alert(error)
        })
    }

    render(){
            return (
                <div className="modal fade show" id="modal-createBoard" tabIndex="-1" role="dialog" aria-labelledby="modal-form">
                    <div className="modal-dialog modal- modal-dialog-centered modal-sm" role="document">
                        <div className="modal-content">
                            <div className="modal-body p-0">
                                <div className="card-body px-lg-5 py-lg-5">
                                    <div className="text-center text-muted mb-4">
                                        <small>Give your email.</small>
                                    </div>
                                    <form role="form" onSubmit={this.handleSubmit}>
                                        <div className="form-group mb-3">
                                            <div className="form-group">
                                            <div className="input-group input-group-alternative">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="ni ni-email-83"/></span>
                                                </div>
                                                <input className="form-control" placeholder="Board name" type="text" value={this.state.boardName} onChange={this.handleBNChange}/>
                                            </div>
                                                <div className="form-group">
                                                    <div className="input-group input-group-alternative">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text"><i className="ni ni-lock-circle-open"/></span>
                                                        </div>
                                                        <select className="form-control" value={this.state.privacy} onChange={this.handlePrivacyChange}>
                                                            <option value="0">Public</option>
                                                            <option value="1">Private</option>
                                                        </select>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <button>Create board</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
}

export default withRouter(ModalFormCreateInBoard);