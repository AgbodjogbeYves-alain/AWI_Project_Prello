import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { render } from 'react-dom';

// route components
import App from '../../ui/pages/Home/App.js';
import LogIn from '../../ui/pages/LogIn/LogIn.js';
import SignUp from '../../ui/pages/SignUp/SignUp.js';

Meteor.startup(() => {
    render(
        <Router>
            <div>
                <Route exact path="/" component={App} />
                <Route path="/login" component={LogIn}/>
                <Route path="/signup" component={SignUp}/>
            </div>
        </Router>,
        document.getElementById('render-target')
    )
})