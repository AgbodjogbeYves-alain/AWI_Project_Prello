import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import NavBar from "../../partials/NavBar.js"
import ProfileForm from "./ProfileForm/ProfileForm.js"

class MyAccount extends Component {
    render() {
        let currentUser = this.props.currentUser;
        return (
            <main class="profile-page">
            <NavBar/>
                <section class="section-profile-cover section-shaped my-0">
                    <div class="shape shape-style-1 shape-primary alpha-4">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="separator separator-bottom separator-skew">
                        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <polygon class="fill-white" points="2560 0 2560 100 0 100"></polygon>
                        </svg>
                    </div>
                </section>
                <section class="section">
                    <div class="container">
                        <div class="card card-profile shadow mt--300">
                            <div class="px-4">
                                <div class="row justify-content-center">
                                    <div class="col-lg-3 order-lg-2">
                                        <div class="card-profile-image">
                                            <a href="#">
                                                <img src="./img/profile_placeholder.png" class="rounded-circle"/>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col-lg-4 order-lg-3 ">
                                        <div class="card-profile-actions py-4 mt-lg-0 text-right">
                                            <a href="#" class="btn btn-sm btn-danger mr-4">Remove Account</a>
                                        </div>
                                    </div>
                                    <div class="col-lg-4 order-lg-1">
                                        <div class="card-profile-actions py-4 mt-lg-0">
                                            <label class="custom-toggle">
                                                <input type="checkbox"/>
                                                <span class="custom-toggle-slider rounded-circle"></span>
                                            </label>
                                            <h6>Enable Mails</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-center mt-5">
                                    <h3>
                                        {currentUser ? currentUser.profile.lastname + ', ' + currentUser.profile.firstname : ''}
                                    </h3>
                                    <div class="h6 font-weight-300">
                                        <i class="ni location_pin mr-2"></i>{currentUser ? currentUser.emails[0].address : ''}
                                    </div>
                                    <div className="container profile-form-container">
                                        {currentUser ? <ProfileForm user={currentUser}/> : ''}
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

export default withTracker(() => {
    return {
      currentUser: Meteor.user(),
    };
})(MyAccount);