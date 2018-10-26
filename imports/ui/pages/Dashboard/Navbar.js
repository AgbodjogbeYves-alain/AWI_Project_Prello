import React, {Component} from 'react';

import ModalFormCreateInBoard from "../../layouts/ModalFormCreateInBoard";

export default class Navbar extends Component {

    constructor (props) {
        super(props);
        this.state = {
            showModal: false,
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    render(){
        return (

            <div>
                <ModalFormCreateInBoard privacy={'0'}/>

                <nav className="navbar navbar-expand-lg navbar-dark bg-default">

                    <div className="container">
                <a className="navbar-brand" href="#">Default Color</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbar-default">
                    <div className="navbar-collapse-header">
                        <div className="row">
                            <div className="col-6 collapse-brand">
                                <a href="index.html">
                                    <img src="assets/img/brand/blue.png"/>
                                </a>
                            </div>
                            <div className="col-6 collapse-close">
                                <button type="button" className="navbar-toggler" data-toggle="collapse"
                                        data-target="#navbar-default" aria-controls="navbar-default"
                                        aria-expanded="false" aria-label="Toggle navigation">
                                    <span></span>
                                    <span></span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <ul className="navbar-nav ml-lg-auto">
                        <li className="nav-item dropdown">
                            <a className="nav-link nav-link-icon" href="#" id="navbar-default_dropdown_1"
                               role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="ni ni-settings-gear-65"/>
                                <span className="nav-link-inner--text d-lg-none">Settings</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right"
                                 aria-labelledby="navbar-default_dropdown_1">
                                <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbar_global" aria-controls="navbar_global" aria-expanded="false" aria-label="Toggle navigation">
                                    Add
                                </button>
                                <a className="dropdown-item" data-toggle="modal" data-target="#modal-createBoard">Create board</a>
                                <a className="dropdown-item" href="#">Create team</a>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-link-icon" href="#">
                                <i className="ni ni-notification-70"/>
                                <span className="nav-link-inner--text d-lg-none">Profile</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

        </nav>

    </div>


    )
    }
}


