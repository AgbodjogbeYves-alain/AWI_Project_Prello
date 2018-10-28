import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import Alert from "../../partials/Alert.js";
import NavBar from "../../partials/NavBar.js"

export default class SignUp extends Component {

    constructor(props) {
        super(props);
     
        this.state = {
            alerts: []
        };
    }

    addAlert(type, text) {
        let newAlerts = this.state.alerts;
        newAlerts.push({type: type, text: text});

        this.setState({
            alerts: newAlerts
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let that = this;

        let firstname = this.firstname.value;
        let lastname = this.lastname.value;
        let email = this.email.value;
        let email2 = this.email2.value;
        let password = this.password.value;
        let password2 = this.password2.value;

        if(email !== email2) that.addAlert('danger', "Emails doesn't match.")
        else if(password !== password2) that.addAlert('danger', "Passwords doesn't match.")
        else if(password.length < 6) that.addAlert('danger', "Too short password, at least 6 characters.")
        else if(!email || !lastname || !firstname) that.addAlert('danger', "Some fields are empty.")
        else {
           Meteor.call('users.signUp', firstname, lastname, email, password, function(error){
               if(error) that.addAlert('danger', error.reason)
               else that.addAlert('success', "You're now Signed Up !")
           });
        }
    }

    renderAlerts(){
        return this.state.alerts.map(a => (<Alert key={this.state.alerts.indexOf(a)} type={a.type}  text={a.text}/>));
    }

    render() {
        if(Meteor.userId()) return(<Redirect to='/myaccount'/>)
        return(
            <main>
                <NavBar/>
                <section className="section section-shaped section-lg">
                <div className="shape shape-style-1 bg-gradient-default">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
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
                            <small>Sign up with</small>
                            </div>
                            <div className="text-center">
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
                            <small>Or sign up with credentials</small>
                            </div>
                            {this.renderAlerts()}
                            <form role="form" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <div className="input-group input-group-alternative mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="ni ni-hat-3"></i></span>
                                        </div>
                                        <input className="form-control" placeholder="Lastname" type="text" ref={(t) => this.lastname = t}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group input-group-alternative mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="ni ni-hat-3"></i></span>
                                        </div>
                                        <input className="form-control" placeholder="Firstname" type="text"  ref={(t) => this.firstname = t}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group input-group-alternative mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                                    </div>
                                    <input className="form-control" placeholder="Email" type="email"  ref={(t) => this.email = t}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group input-group-alternative mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                                    </div>
                                    <input className="form-control" placeholder="Confirm Email" type="email"  ref={(t) => this.email2 = t}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group input-group-alternative">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="ni ni-lock-circle-open"></i></span>
                                    </div>
                                    <input className="form-control" placeholder="Password" type="password"  ref={(t) => this.password = t}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group input-group-alternative">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="ni ni-lock-circle-open"></i></span>
                                    </div>
                                    <input className="form-control" placeholder="Confirm Password" type="password"  ref={(t) => this.password2 = t}/>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary mt-4">Create account</button>
                                </div>
                            </form>
                        </div>
                        
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 text-right">
                                <Link to="login" className="text-light">
                                    <small>Log In</small>
                                </Link>
                            </div>
                        </div>
                        
                    </div>
                    </div>
                </div>
                </section>
            </main>
        );
    }
}