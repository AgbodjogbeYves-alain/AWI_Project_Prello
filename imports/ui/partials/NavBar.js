import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createHashHistory } from 'history'
import { withRouter } from "react-router-dom";

class NavBar extends Component {

    handleLogOut(){
        let that = this;
        Meteor.logout(function(error){
            if(error) alert(error.reason)
            else that.props.history.push("/");
        });
        
    }

    renderLinks(){
        if(Meteor.userId()){
            return (
                <ul className="navbar-nav align-items-lg-center ml-lg-auto navbar-nav-hover">
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href='#' role="button">
                            <i className="ni ni-single-02 ni-lg"></i>
                            <span className="nav-link-inner--text d-lg-none">My account</span>
                        </a>
                        <div className="dropdown-menu">
                            <Link to="/myaccount" className="dropdown-item">My Account</Link>
                            <a href='#' onClick={() => this.handleLogOut()} className="dropdown-item">Log Out</a>
                        </div>
                    </li>
                </ul>
            );
        }
        else {
            return (
                <ul className="navbar-nav align-items-lg-center ml-lg-auto">
                    <li className="nav-item d-none d-lg-block ml-lg-4">
                        <Link to="/login" className="btn btn-neutral btn-icon">
                            <span className="btn-inner--icon">
                            <i className="fa fa-cloud-download mr-2"></i>
                            </span>
                            <span className="nav-link-inner--text">Log In</span>
                        </Link>
                    </li>
                    
                    <li className="nav-item d-none d-lg-block ml-lg-4">
                        <Link to="/signup" className="btn btn-neutral btn-icon">
                            <span className="btn-inner--icon">
                            <i className="fa fa-cloud-download mr-2"></i>
                            </span>
                            <span className="nav-link-inner--text">Sign Up</span>
                        </Link>
                    </li>
                </ul>
            );
        }
    }

    render(){
        return (
            <nav id="navbar-main" className="navbar navbar-main navbar-expand-lg navbar-dark bg-primary headroom">
                <div className="container">
                    <Link className="navbar-brand mr-lg-5" to="/">
                        <img src="../assets/img/brand/white.png"/>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar_global" aria-controls="navbar_global" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse" id="navbar_global">
                    <div className="navbar-collapse-header">
                        <div className="row">
                        <div className="col-6 collapse-brand">
                            <Link to="/">
                            <img src="../assets/img/brand/blue.png"/>
                            </Link>
                        </div>
                        <div className="col-6 collapse-close">
                            <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbar_global" aria-controls="navbar_global" aria-expanded="false" aria-label="Toggle navigation">
                            <span></span>
                            <span></span>
                            </button>
                        </div>
                        </div>
                    </div>
                    <ul className="navbar-nav navbar-nav-hover align-items-lg-center">
                        <li className="nav-item dropdown">
                            <a className="nav-link" data-toggle="dropdown" href='#' role="button">
                                <i className="ni ni-collection d-lg-none"></i>
                                <span className="nav-link-inner--text">Actions</span>
                            </a>
                            <div className="dropdown-menu">
                                <Link to="/" className="dropdown-item">Home</Link>
                                <Link to="/login" className="dropdown-item">Login</Link>
                                <Link to="/signup" className="dropdown-item">Register</Link>
                            </div>
                        </li>
                    </ul>
                    {this.renderLinks()}
                    </div>
                </div>
            </nav>
        );
    }
}

export default withRouter(NavBar);