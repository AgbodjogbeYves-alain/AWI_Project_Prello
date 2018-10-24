import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { render } from 'react-dom';
import Navbar from "./Navbar";

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                <Navbar/>
                <Route render={({ history}) => (
                <button type='button'>
                    <Link to="/signup">Click Me!</Link>
                </button>
            )} />
            </div>
        )
    }
}