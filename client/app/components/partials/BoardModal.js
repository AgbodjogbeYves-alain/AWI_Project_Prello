import React, { Component } from 'react';
import { connect } from 'react-redux';

import { callCreateBoard } from '../../actions/BoardActions';

class BoardModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            boardTitle: this.props.board ? this.props.doard.boardTitle : '',
        };
    }

    handleCreateBoard(){
        const { dispatchCallCreateBoard } = this.props;
        dispatchCallCreateBoard(this.state.boardTitle);
    }

    render(){
        return ( 
            <div className="modal fade" id="board-modal" tabIndex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true">
                <div className="modal-dialog modal- modal-dialog-centered modal-" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h6 className="modal-title" id="modal-title-default">
                                {this.props.type == 'edit' ? "Edit" : "Create"} Board {this.state.boardTitle}
                            </h6>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>

                        <div className="modal-body">
                        <form role="form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group mb-3">
                                <div className="input-group input-group-alternative">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                                    </div>
                                    <input 
                                        className="form-control" 
                                        placeholder="Name" 
                                        type="text"
                                        value={this.state.boardTitle}
                                        onChange={(e) => this.setState({boardTitle: e.target.value})}/>
                                </div>
                            </div>
                        </form>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-link" data-dismiss="modal">Close</button>
                            {this.props.type == "edit" ?
                                <button 
                                    className="btn btn-primary  ml-auto" 
                                    data-dismiss="modal"
                                    onClick={() => this.handleEditBoard()}>
                                    Edit
                                </button>
                                :
                                <button 
                                    className="btn btn-success  ml-auto" 
                                    data-dismiss="modal"
                                    onClick={() => this.handleCreateBoard()}>
                                    Create
                                </button>
                            }
                            
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    dispatchCallCreateBoard: (boardTitle) => dispatch(callCreateBoard(boardTitle)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardModal);
