import React, { Component } from 'react';

export default class ForgottenPasswordModal extends Component {
    render(){
        return (
            <div className="modal fade show" id="modal-forgottenPassword" tabIndex="-1" role="dialog" aria-labelledby="modal-form">
                <div className="modal-dialog modal- modal-dialog-centered modal-sm" role="document">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <div className="card-body px-lg-5 py-lg-5">
                                <div className="text-center text-muted mb-4">
                                    <small>Give your email.</small>
                                </div>
                                <form role="form">
                                    <div className="form-group mb-3">
                                        <div className="input-group input-group-alternative">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                                            </div>
                                            <input className="form-control" placeholder="Email" type="email"/>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="button" className="btn btn-primary my-4">Send reset password</button>
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