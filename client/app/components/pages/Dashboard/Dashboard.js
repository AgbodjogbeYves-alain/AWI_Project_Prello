import React, {Component} from 'react';
import NavBar from "../../partials/NavBar";
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import BoardModal from "../../partials/BoardModal.js"

import Teams from "./Teams/Teams.js";
import Boards from "./Boards/Boards.js";

class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const { user } = this.props;
        if(user && !user.profile) return(<Redirect to='/'/>)
        return(
            <main id="dashboard">
                <NavBar/>
                <BoardModal/>
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

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(Dashboard);
