import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import NavBar from "../../partials/NavBar.js";
 
// App component - represents the whole app
class Home extends Component {
    render() {
        const { user } = this.props;
        if(user) return(<Redirect to='/dashboard'/>)
        return (
            <main>
                <NavBar/>
                <div className="position-relative">
                    <section className="section section-lg section-shaped pb-250">
                        <div className="shape shape-style-1 shape-default">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="container py-lg-md d-flex">
                            <div className="col px-0">
                                <div className="row">
                                <div className="col-lg-6">
                                    <h1 className="display-3  text-white">PRELLO
                                        <span>Manage your projects with efficience and ease !</span>
                                    </h1>
                                    <p className="lead  text-white">The design system comes with four pre-built pages to help you get started faster. You can change the text and images and you're good to go.</p>
                                    <div className="btn-wrapper">
                                        <Link to="/login" className="btn btn-info btn-icon mb-3 mb-sm-0">
                                            <span className="btn-inner--icon"><i className="fa fa-sign-in fa-lg"></i></span>
                                            <span className="btn-inner--text">Log In</span>
                                        </Link>
                                        <Link to="/signup" className="btn btn-white btn-icon mb-3 mb-sm-0">
                                            <span className="btn-inner--icon"><i className="fa fa-user-plus fa-lg"></i></span>
                                            <span className="btn-inner--text">Sign Up</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="separator separator-bottom separator-skew">
                        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
                        </svg>
                    </div>
                </section>
            </div>
        </main>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(Home);