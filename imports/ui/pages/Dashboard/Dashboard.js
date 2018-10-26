import React, {Component} from 'react';
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