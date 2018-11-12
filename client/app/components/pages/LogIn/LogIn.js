import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import asteroid from '../../../common/asteroid';
import GoogleLogin from 'react-google-login';

import NavBar from "../../partials/NavBar.js"
import ForgottenPasswordModal from "./ForgottenPasswordModal/ForgottenPasswordModal.js"
import Alert from "../../partials/Alert.js"


class LogIn extends Component {

    constructor(props) {
        super(props);
     
        this.state = {
            alerts: []
        };

        this.googleLogin = this.googleLogin.bind(this);
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
        asteroid.loginWithPassword({email: this.email.value, password: this.password.value})
        .then(function(){
            that.addAlert("success", "You're Loged In !");
            that.props.history.push('/dashboard');
        })
        .catch(function(error){
            that.addAlert("danger", error.reason)
        })
    }

    googleLogin(token){
        event.preventDefault();
        let that = this;
        asteroid.call("users.googleLogin",token)
        .then((result) => {
            localStorage.setItem('ws://localhost:9000/websocket__login_token__',result.token)
            that.addAlert("success", "You're Loged In !");
            that.props.history.push('/dashboard');
        })
        .catch(function(error){
            that.addAlert("danger", error.reason)
        })
    }

    renderAlerts(){
        return this.state.alerts.map(a => (<Alert key={this.state.alerts.indexOf(a)} type={a.type}  text={a.text}/>));
    }

    render() {
        const sucessResponseGoogle = (response) => {
            let tokenId = response.getAuthResponse().id_token;
            this.googleLogin(tokenId);
            
          }

        const failResponseGoogle = (response) =>{
            alert("An error occured !! Please try again!! ")
        }

        const { user } = this.props;
        if(user) return(<Redirect to='/dashboard'/>)
        return (
            <main>
                <NavBar/>
                <div className='alert-container'>
                    
                </div>
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
                                            <small>Sign in with</small>
                                        </div>
                                        <div className="btn-wrapper text-center">
                                        <GoogleLogin
                                            clientId="909976969961-r4v6ls5qbgjvslotg7trcb066vig4cb8.apps.googleusercontent.com"
                                            render={renderProps => (
                                                <a onClick={renderProps.onClick} href="#" className="btn btn-neutral btn-icon">
                                                <span className="btn-inner--icon">
                                                    <img src="../assets/img/icons/common/google.svg"/>
                                                </span>
                                                <span className="btn-inner--text">Google</span>
                                                </a>
                                            )}
                                            buttonText="Login"
                                            onSuccess={sucessResponseGoogle}
                                            onFailure={failResponseGoogle}
                                        />
                                        </div>
                                    </div>
                                    <div className="card-body px-lg-5 py-lg-5">
                                        <div className="text-center text-muted mb-4">
                                            <small>Or sign in with credentials</small>
                                        </div>
                                        <div className="alert-container">
                                            {this.renderAlerts()}
                                        </div>
                                        <form role="form" onSubmit={(event) => this.handleSubmit(event)}>
                                            <div className="form-group mb-3">
                                                <div className="input-group input-group-alternative">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                                                    </div>
                                                    <input className="form-control" placeholder="Email" type="email" ref={(email) => this.email = email}/>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="input-group input-group-alternative">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="ni ni-lock-circle-open"></i></span>
                                                    </div>
                                                    <input className="form-control" placeholder="Password" type="password" ref={(password) => this.password = password}/>
                                                </div>
                                            </div>
                                            <div className="custom-control custom-control-alternative custom-checkbox">
                                                <input className="custom-control-input" id=" customCheckLogin" type="checkbox"/>
                                                <label className="custom-control-label" htmlFor=" customCheckLogin">
                                                    <span>Remember me</span>
                                                </label>
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary my-4">Sign in</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <a href="" className="text-light" data-toggle="modal" data-target="#modal-forgottenPassword">
                                            <small>Forgot password?</small>
                                        </a>
                                    </div>
                                    <div className="col-6 text-right">
                                        <Link to="signup" className="text-light">
                                            <small>Create new account</small>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ForgottenPasswordModal/>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(withRouter(LogIn));