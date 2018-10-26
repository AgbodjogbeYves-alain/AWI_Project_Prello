import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { render } from 'react-dom';
import ScrollToTop from'./ScrollToTop.js';

// route components
import Home from '../../ui/pages/Home/Home.js';
import LogIn from '../../ui/pages/LogIn/LogIn.js';
import SignUp from '../../ui/pages/SignUp/SignUp.js';
import MyAccount from '../../ui/pages/MyAccount/MyAccount.js';

Meteor.startup(() => {
    render(
        <Router>
            <ScrollToTop>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={LogIn}/>
                    <Route path="/signup" component={SignUp}/>
                    <Route path="/myaccount" component={MyAccount}/>
                </Switch>
            </ScrollToTop>
        </Router>,
        document.getElementById('render-target')
    )
})