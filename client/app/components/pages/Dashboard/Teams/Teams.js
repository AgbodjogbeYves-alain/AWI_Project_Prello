import React, {Component} from 'react';
import ModalFormCreateTeam from '../ModalFormCreateTeam';


export default class Teams extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                <h2>Teams</h2>
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-success" data-toggle="modal" data-target="#team-modal">
                            Create a new team
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}