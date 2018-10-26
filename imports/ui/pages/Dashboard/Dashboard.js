import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { render } from 'react-dom';
import Navbar2 from "./Navbar";

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                <Navbar2/>
            </div>
        )
    }
}