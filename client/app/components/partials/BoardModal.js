import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { callCreateBoard } from '../../actions/BoardActions';
import Alert from './Alert';

class BoardModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            boardTitle: this.props.board ? this.props.doard.boardTitle : '',
            alerts: []
        };
    }

    addAlert(type, text) {
        let newAlerts = this.state.alerts;
        newAlerts.push({type: type, text: text});

        this.setState({
            alerts: newAlerts
        });
    }

    renderAlerts(){
        return this.state.alerts.map(a => (<Alert key={this.state.alerts.indexOf(a)} type={a.type}  text={a.text}/>));
    }

    resetFields(){
        this.setState({
            boardTitle: ''
        });
    }

    handleCreateBoard(){
        let that = this;
        const { dispatchCallCreateBoard } = this.props;
        dispatchCallCreateBoard(this.state.boardTitle)
        .then((result) => {
            that.props.history.push("/board/" + result.data._id)
        })
        .catch((error) => {
            that.addAlert("danger", error.reason)
        })
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
                            <div>
                                {this.renderAlerts()}
                            </div>
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
                                    onClick={() => this.handleEditBoard()}>
                                    Edit
                                </button>
                                :
                                <button 
                                    className="btn btn-success  ml-auto"
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardModal));
