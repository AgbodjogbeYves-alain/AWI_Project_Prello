import React, {Component} from 'react';
import NavBar from "../../partials/NavBar";

import Teams from "./Teams/Teams.js";
import Boards from "./Boards/Boards.js";

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <main id="dashboard">
                <NavBar/>
                <div className="container">
                    <div className="row">
                        <div className="col-3 column" id="teams">
                            <Teams/>
                        </div>
                        <div className="col-9 column" id="boards">
                            <Boards/>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}