import React, {Component} from 'react';

export default class Board extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className="col-3 board-card">
                <div className="card card-stats mb-4 mb-lg-0">
                    <div className="card-body">
                    <h6>{this.props.title}</h6>
                    </div>
                </div>
            </div>
        )
    }
}