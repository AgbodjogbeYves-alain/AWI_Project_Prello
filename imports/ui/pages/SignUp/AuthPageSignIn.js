import React, { Component } from 'react';
import axios from 'axios';


class SubscribeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '',
                      firstname: '',
                      lastname: '',
                      email: '',
                      password: ''

        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
        this.handleLastnameChange = this.handleLastnameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);


        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    handleFirstnameChange(event) {
        this.setState({firstname: event.target.value});
    }

    handleLastnameChange(event) {
        this.setState({lastname: event.target.value});
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        axios.post('/api',{ state : this.state})
            .then((response) => {
                console.log(response)
            })
        event.preventDefault();
    }

    render() {
        return (
            <main>
                <section className="section section-shaped section-lg">
                    <div>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="container pt-lg-md">
                        <div className="row justify-content-center">
                            <div className="col-lg-5">
                                <div className="card bg-secondary shadow border-0">
                                    <div className="card-header bg-white pb-5">
                                        <div className="text-muted text-center mb-3">
                                            <small>Sign in with</small>
                                        </div>
                                        <div className="btn-wrapper text-center">
                                            <a href="#" className="btn btn-neutral btn-icon">
                                            <span className="btn-inner--icon">
                                                <img src="../assets/img/icons/common/google.svg"/>
                                            </span>
                                                <span className="btn-inner--text">Google</span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="card-body px-lg-5 py-lg-5">
                                        <div className="text-center text-muted mb-4">
                                            <small>Or sign in with credentials</small>
                                        </div>
                                        <form role="form" onSubmit={this.handleSubmit}>
                                            <div className="form-group mb-3">
                                                <div className="input-group input-group-alternative">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="single-02"></i></span>
                                                    </div>
                                                    <input className="form-control" placeholder="Username" type="text" value={this.state.username} onChange={this.handleUsernameChange}/>
                                                </div>
                                            </div>
                                            <div className="form-group mb-3">
                                                <div className="input-group input-group-alternative">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="single-02"></i></span>
                                                    </div>
                                                    <input className="form-control" placeholder="ex, Pierre" type="text" value={this.state.firstname} onChange={this.handleFirstnameChange}/>
                                                </div>
                                            </div>
                                            <div className="form-group mb-3">
                                                <div className="input-group input-group-alternative">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="single-02"></i></span>
                                                    </div>
                                                    <input className="form-control" placeholder="ex, Dupont" type="text" value={this.state.lastname} onChange={this.handleLastnameChange}/>
                                                </div>
                                            </div>
                                            <div className="form-group mb-3">
                                                <div className="input-group input-group-alternative">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                                                    </div>
                                                    <input className="form-control" placeholder="ex, name@provider.com" type="email" value={this.state.email} onChange={this.handleEmailChange}/>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="input-group input-group-alternative">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="ni ni-lock-circle-open"></i></span>
                                                    </div>
                                                    <input className="form-control" placeholder="Password" type="password" value={this.state.password} onChange={this.handlePasswordChange}/>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary my-4">Sign in</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )}

}

export default SubscribeForm