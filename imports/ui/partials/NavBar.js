import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withRouter } from "react-router-dom";
import ModalFormCreateInBoard from "../pages/Dashboard/ModalFormCreateInBoard";

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
                    <li>
                        <a className="nav-link notifications" href='#' >
                            <i className="ni ni-bell-55 ni-lg"></i>
                            <span className="badge badge-danger">4</span>
                            <span className="nav-link-inner--text d-lg-none">Notifications</span>
                        </a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link nav-link-icon" href="#" id="navbar-default_dropdown_1"
                           role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="ni ni-settings-gear-65"/>
                            <span className="nav-link-inner--text d-lg-none">Settings</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right"
                             aria-labelledby="navbar-default_dropdown_1">
                            <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbar_global" aria-controls="navbar_global" aria-expanded="false" aria-label="Toggle navigation">
                                Add
                            </button>
                            <a className="dropdown-item" data-toggle="modal" data-target="#modal-createBoard">Create board</a>
                            <a className="dropdown-item" href="#">Create team</a>
                            <a className="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href='#' role="button">
                            <i className="ni ni-single-02 ni-lg"></i>
                            <span className="nav-link-inner--text d-lg-none">My Account</span>
                        </a>
                        <div className="dropdown-menu">
                            <Link to="/myaccount" className="dropdown-item">
                                <i className="ni ni-circle-08"></i>
                                My Account
                            </Link>
                            <a href='#' onClick={() => this.handleLogOut()} className="dropdown-item">
                                <i className="ni ni-button-power"></i>
                                Log Out
                            </a>
                        </div>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href='#' role="button">
                            <i className="ni ni-single-02 ni-lg"/>
                            <span className="nav-link-inner--text d-lg-none">Notification</span>
                        </a>
                        <div className="dropdown-menu">
                            <a href='#' className="dropdown-item">Notification right there</a>
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
                                <i className="fa fa-sign-in fa-lg"></i>
                            </span>
                            <span className="btn-inner--text">Log In</span>
                        </Link>
                    </li>
                    
                    <li className="nav-item d-none d-lg-block ml-lg-4">
                        <Link to="/signup" className="btn btn-neutral btn-icon">
                            <span className="btn-inner--icon">
                            <i className="fa fa-user-plus fa-lg"></i>
                            </span>
                            <span className="btn-inner--text">Sign Up</span>
                        </Link>
                    </li>
                </ul>
            );
        }
    }

    render(){
        return (
<div>
    <ModalFormCreateInBoard privacy={'0'}/>

    <nav id="navbar-main" className="navbar navbar-main navbar-expand-lg navbar-dark bg-primary headroom">

                <div className="container">
                    <Link className="navbar-brand mr-lg-5" to={Meteor.userId() ? "/dashboard" : "/"}>
                        <img src="../assets/img/brand/white.png"/>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar_global" aria-controls="navbar_global" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse" id="navbar_global">
                    <div className="navbar-collapse-header">
                        <div className="row">
                        <div className="col-6 collapse-brand">
                            <Link to={Meteor.userId() ? "/dashboard" : "/"}>
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
                    {this.renderLinks()}
                    </div>
                </div>
            </nav>
</div>
        );
    }
}

export default withRouter(NavBar);