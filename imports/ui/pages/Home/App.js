import React, { Component } from 'react';
import { Link } from 'react-router-dom';
 
// App component - represents the whole app
export default class App extends Component {
    render() {
    return (
        <main>
            <div class="position-relative">
                <section class="section section-lg section-shaped pb-250">
                    <div class="shape shape-style-1 shape-default">
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
                    <div class="container py-lg-md d-flex">
                        <div class="col px-0">
                            <div class="row">
                            <div class="col-lg-6">
                                <h1 class="display-3  text-white">PRELLO
                                    <span>Manage your projects with efficience and ease !</span>
                                </h1>
                                <p class="lead  text-white">The design system comes with four pre-built pages to help you get started faster. You can change the text and images and you're good to go.</p>
                                <div class="btn-wrapper">
                                    <Link to="/login" class="btn btn-info btn-icon mb-3 mb-sm-0">
                                        <span class="btn-inner--icon"><i class="fa fa-code"></i></span>
                                        <span class="btn-inner--text">Log In</span>
                                    </Link>
                                    <Link to="/signup" class="btn btn-white btn-icon mb-3 mb-sm-0">
                                        <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i></span>
                                        <span class="btn-inner--text">Sign Up</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="separator separator-bottom separator-skew">
                    <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <polygon class="fill-white" points="2560 0 2560 100 0 100"></polygon>
                    </svg>
                </div>
            </section>
        </div>
    </main>
    );
  }
}
