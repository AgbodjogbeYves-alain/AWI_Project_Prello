import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import NavBar from "../../partials/NavBar.js";
import ProfileForm from "./ProfileForm/ProfileForm.js";
import ChangePasswordForm from "./ChangePasswordForm/ChangePasswordForm.js";
import EnabledMailsInput from "./EnabledMailsInput/EnabledMailsInput.js";
import ConfirmModal from "./../../partials/ConfirmModal.js";




class MyAccount extends Component {


    removeAccount(){
        Meteor.call('users.remove', function(error){
            if(error) alert(error.reason)
            else alert("ok");
        })
    }

    render() {
        const { user } = this.props;
        //if(!user || !user.profile) return(<Redirect to='/'/>)
        console.log(user)
        return (
            <main className="profile-page">
            <NavBar/>
            <ConfirmModal 
                id={'removeModal'}
                text={"All your account will be removed. Are you sure ?"} 
                confirmAction={this.removeAccount}
            />
                <section className="section-profile-cover section-shaped my-0">
                    <div className="shape shape-style-1 shape-primary alpha-4">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="separator separator-bottom separator-skew">
                        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
                        </svg>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <div className="card card-profile shadow mt--300">
                            <div className="px-4">
                                <div className="row justify-content-center">
                                    <div className="col-lg-3 order-lg-2">
                                        <div className="card-profile-image">
                                            <a href="#">
                                                <img src="./img/profile_placeholder.png" className="rounded-circle"/>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 order-lg-3 ">
                                        <div className="card-profile-actions py-4 mt-lg-0 text-right">
                                            <button 
                                                className="btn btn-warning btn-sm" 
                                                data-toggle="modal" 
                                                data-target="#removeModal">
                                                Remove account
                                            </button>
                                        </div>
                                        <div className="card-profile-actions py-4 mt-lg-0 text-right">
                                            <button 
                                                className="btn btn-primary btn-sm">
                                                Link with Trello
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 order-lg-1">
                                        {user ? <EnabledMailsInput user={user}/> : ''}
                                    </div>
                                </div>
                                <div className="text-center mt-5">
                                    <h3>
                                        {user ? user.profile.lastname + ', ' + user.profile.firstname : ''}
                                    </h3>
                                    <div className="h6 font-weight-300">
                                        <i className="ni location_pin mr-2"></i>{user ? user.profile.email : ''}
                                    </div>
                                    <div className="container profile-form-container">
                                        {user ? <ProfileForm user={user}/> : ''}
                                    </div>
                                    <div className="container profile-form-container">
                                        <ChangePasswordForm/>
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

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(MyAccount);



