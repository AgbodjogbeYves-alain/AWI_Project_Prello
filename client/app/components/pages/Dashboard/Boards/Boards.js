import React, {Component} from 'react';
import { connect } from 'react-redux';

import Board from './Board/Board.js';

class Boards extends Component {

    constructor(props) {
        super(props);
    }

    renderBoards(){
        return this.props.boards.map((b,i) =>
            <Board board={b} background={b.boardBackground} title={b.boardTitle} key={i} id={b._id}/>
        );
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
                    <button 
                        className="btn btn-primary btn-sm"
                        data-toggle="modal"
                        data-target="#import-modal"
                    >
                        Import from another App
                    </button>
                </div>
                <div className="row w-100">
                    {this.renderBoards()}
                    <div className="col-12">
                        <button className="btn btn-success" data-toggle="modal" data-target="#board-modal">
                            {this.props.activedTeam ?
                                "Create a new board for " + this.props.activedTeam.teamName : "Create a new board"
                            }
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Boards);