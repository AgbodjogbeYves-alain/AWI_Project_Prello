import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ScrollToTop from'./ScrollToTop.js';

// route components
import Home from './pages/Home/Home.js';
import LogIn from './pages/LogIn/LogIn.js';
import SignUp from './pages/SignUp/SignUp.js';
import Dashboard from './pages/Dashboard/Dashboard.js';
import Board from './pages/Board/BoardDisplay.js';
import MyAccount from './pages/MyAccount/MyAccount.js';

export default class MyRouter extends Component{
    render(){
        return (
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
        </Router>
        )
    }
}