import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { render } from 'react-dom';
import ScrollToTop from'./app/components/ScrollToTop.jsp.js';

// route components
import Home from '../../../imports/ui/pages/Home/Home.js';
import LogIn from '../imports/ui/pages/LogIn/LogIn.js';
import SignUp from '../../../imports/ui/pages/SignUp/SignUp.js';
import Dashboard from '../../../imports/ui/pages/Dashboard/Dashboard.js'
import Board from '../../../imports/ui/pages/Board/BoardDisplay.js'

import MyAccount from '../../../imports/ui/pages/MyAccount/MyAccount.js';

Meteor.startup(() => {
    render(
        <Router>
            <ScrollToTop>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={LogIn}/>
                    <Route path="/signup" component={SignUp}/>
                    <Route path="/myaccount" component={MyAccount}/>
                    <Route path='/dashboard' component={Dashboard}/>
                    <Route path='/board/:id' component={Board}/>
                    <Route path="/myaccount" component={MyAccount}/>
                </Switch>
            </ScrollToTop>
        </Router>,
        document.getElementById('render-target')
    )
})