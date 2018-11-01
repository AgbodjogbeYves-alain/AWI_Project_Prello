import React, {Component} from 'react';

export default class Boards extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                <h2 className="d-inline-block">Boards</h2>
                <div className="float-right" style={{padding: "17px"}}>
                    <div className="custom-control custom-checkbox mb-3 d-inline-block" style={{marginRight: '30px'}}>
                        <input className="custom-control-input" id="followed-boards" type="checkbox"/>
                        <label className="custom-control-label" htmlFor="followed-boards">Followed boards</label>
                    </div>
                    <button className="btn btn-primary btn-sm">Import from another App</button>
                </div>
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-success" data-toggle="modal" data-target="#board-modal">
                            Create a new board
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}