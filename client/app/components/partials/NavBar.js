import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import {SearchBar} from "./SearchBar"
import { connect } from 'react-redux';
import asteroid from '../../common/asteroid';
import { resetBoards } from '../../actions/BoardActions';
import { resetTeams } from '../../actions/TeamActions';
import { resetUsers } from '../../actions/UserActions';

class NavBar extends Component {

    handleLogOut(){
        asteroid.logout()
        .then(() => {
            this.props.history.push("/");
            this.props.dispatchResetBoards();
            this.props.dispatchResetTeams();
            this.props.dispatchResetUsers();
        });
    }

    renderLinks(){
        const { user } = this.props
        if(user){
            return (
                <ul className="navbar-nav align-items-lg-center ml-lg-auto navbar-nav-hover">
                    <li>
                        <Link to={"/dashboard"} className="nav-link" href='' >
                            <i className="ni ni-tv-2 ni-lg"></i>
                            <span className="nav-link-inner--text d-lg-none">Accueil</span>
                        </Link>
                    </li>

                    <li>
                        <a className="nav-link notifications" href='#' >
                            <i className="ni ni-bell-55 ni-lg"></i>
                            <span className="badge badge-danger">4</span>
                            <span className="nav-link-inner--text d-lg-none">Notifications</span>
                        </a>
                    </li>

                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href='#' role="button">
                            <i className="ni ni-single-02 ni-lg"></i>
                            <span className="nav-link-inner--text d-lg-none">My Account</span>
                        </a>
                        <div className="dropdown-menu">
                            <Link to="/myaccount" className="dropdown-item">
                                <i className="ni ni-circle-08"></i>
                                My Account
                            </Link>
                            <a href='#' onClick={() => this.handleLogOut()} className="dropdown-item">
                                <i className="ni ni-button-power"></i>
                                Log Out
                            </a>
                        </div>
                    </li>
                </ul>
            );
        }
        else {
            return (
                <ul className="navbar-nav align-items-lg-center ml-lg-auto">
                    <li className="nav-item d-none d-lg-block ml-lg-4">
                        <Link to="/login" className="btn btn-neutral btn-icon">
                            <span className="btn-inner--icon">
                                <i className="fa fa-sign-in fa-lg"></i>
                            </span>
                            <span className="btn-inner--text">Log In</span>
                        </Link>
                    </li>

                    <li className="nav-item d-none d-lg-block ml-lg-4">
                        <Link to="/signup" className="btn btn-neutral btn-icon">
                            <span className="btn-inner--icon">
                            <i className="fa fa-user-plus fa-lg"></i>
                            </span>
                            <span className="btn-inner--text">Sign Up</span>
                        </Link>
                    </li>
                </ul>
            );
        }
    }

    render(){
        const { user } = this.props
        return (

            <nav id="navbar-main" className="navbar navbar-main navbar-expand-lg navbar-dark bg-primary headroom">
                <div className="container">
                    <Link className="navbar-brand mr-lg-5" to={user ? "/dashboard" : "/"}>
                        <img src="https://rawcdn.githack.com/AgbodjogbeYves-alain/AWI_Assets/7cf53ef40e7e2346c164640109b845b599cbe915/img/brand/white.png"/>
                    </Link>

                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar_global" aria-controls="navbar_global" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <SearchBar/>
                    <div className="navbar-collapse collapse" id="navbar_global">
                    <div className="navbar-collapse-header">
                        <div className="row">
                        <div className="col-6 collapse-brand">
                            <Link to={user ? "/dashboard" : "/"}>
                                <img src="https://rawcdn.githack.com/AgbodjogbeYves-alain/AWI_Assets/7cf53ef40e7e2346c164640109b845b599cbe915/img/brand/blue.png"/>
                            </Link>
                        </div>
                        <div className="col-6 collapse-close">
                            <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbar_global" aria-controls="navbar_global" aria-expanded="false" aria-label="Toggle navigation">
                            <span></span>
                            <span></span>
                            </button>
                        </div>
                        </div>
                    </div>
                    {this.renderLinks()}
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});
const mapDispatchToProps = dispatch => ({
    dispatchResetBoards: () => dispatch(resetBoards()),
    dispatchResetTeams: () => dispatch(resetTeams()),
    dispatchResetUsers: () => dispatch(resetUsers())
  });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
