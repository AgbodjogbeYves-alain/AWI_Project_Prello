import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { render } from 'react-dom';

// route components
import Home from '../../ui/pages/Home/Home.js';
import LogIn from '../../ui/pages/LogIn/LogIn.js';
import SignUp from '../../ui/pages/SignUp/SignUp.js';
import Dashboard from '../../ui/pages/Dashboard/Dashboard.js'
import NavBar from '../../ui/pages/Dashboard/Navbar.js'
import Board from '../../ui/pages/Home/BoardDisplay.js'
import MyAccount from '../../ui/pages/MyAccount/MyAccount.js';

Meteor.startup(() => {
    render(NavBar,document.getElementById('navbar'))
    render(
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={LogIn}/>
                <Route path="/signup" component={SignUp}/>
                <Route path='/dashboard' component={Dashboard}/>
                <Route path='/board/:id' component={Board}/>
                <Route path="/myaccount" component={MyAccount}/>
            </Switch>
        </Router>,

        document.getElementById('render-target')
    )


})