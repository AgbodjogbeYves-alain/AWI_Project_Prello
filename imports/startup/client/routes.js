import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { render } from 'react-dom';

// route components
import App from '../../ui/pages/Home/App.js';
import LogIn from '../../ui/pages/LogIn/LogIn.js';
import SignUp from '../../ui/pages/SignUp/SignUp.js';
import Dashboard from '../../ui/pages/Dashboard/Dashboard.js'
import NavBar from '../../ui/pages/Dashboard/Navbar.js'
import Board from '../../ui/pages/Home/BoardDisplay.js'

Meteor.startup(() => {
    render(NavBar,document.getElementById('navbar'))
    render(
        <Router>
            <div>
                <Route exact path="/" component={App} />
                <Route path="/login" component={LogIn}/>
                <Route path="/signup" component={SignUp}/>
                <Route path='/dashboard' component={Dashboard}/>
                <Route path='/board/:id' component={Board}/>
            </div>
        </Router>,

        document.getElementById('render-target')
    )


})