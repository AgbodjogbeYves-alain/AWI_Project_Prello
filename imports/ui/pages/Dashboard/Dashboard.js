import React, {Component} from 'react';
import NavBar from "../../partials/NavBar";

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                <NavBar/>
            </div>
        )
    }
}