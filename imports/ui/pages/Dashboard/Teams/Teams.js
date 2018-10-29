import React, {Component} from 'react';

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
                        <button className="btn btn-success">Create a new team</button>
                    </div>
                </div>
            </div>
        )
    }
}