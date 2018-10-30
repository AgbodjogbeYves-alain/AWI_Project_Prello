import React, { Component } from "react";
import {Route, withRouter} from 'react-router-dom'



class ModalFormCreateList extends Component {

    constructor (props) {
        super(props);
        this.state = {
            listName: ''
        };

        this.handleBNChange = this.handleLNChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleLNChange (event) {
        this.setState({ boardName: event.target.value});
    }

    handleSubmit (event) {
        event.preventDefault();

        let listName = this.state.listName;


        Meteor.call('createList',{listName},(error, result) => {
            if(error){
               alert(error)
            }else{
                console.log(result)
            }
        })

    }
            render(){
            return (
                <div className="modal fade show" id="modal-createList" tabIndex="-1" role="dialog" aria-labelledby="modal-form">
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
                                                <input className="form-control" placeholder="List name" type="text" value={this.state.listName} onChange={this.handleLNChange}/>
                                            </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <button>Create list</button>
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

export default withRouter(ModalFormCreateList);
