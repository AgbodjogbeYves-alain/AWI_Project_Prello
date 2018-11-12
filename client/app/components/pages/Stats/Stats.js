import React, {Component} from 'react';
import NavBar from "../../partials/NavBar";
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import asteroid from '../../../common/asteroid';



class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const { user } = this.props;
        if(!user) return(<Redirect to='/'/>)
        return(
            <main id="stats">
                <NavBar/>

            </main>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    boards: state.boards,
    teams: state.teams
});
export default connect(mapStateToProps)(Dashboard);
