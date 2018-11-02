import React, {Component} from 'react';
import { connect } from 'react-redux';

import { callRemoveBoard } from '../../../../../actions/BoardActions';

class Board extends Component {

    constructor(props) {
        super(props);
        this.handleRemoveBoard = this.handleRemoveBoard.bind(this);
    }

    handleRemoveBoard(){
        if(confirm("Are you sure to delete this board ?")){
            const { dispatchCallRemoveBoard } = this.props;
            dispatchCallRemoveBoard(this.props.id)
        }
    }

    render(){
        return(
            <div className="col-3 board-card">
                <div className="card card-stats mb-4 mb-lg-0">
                    <div className="card-body">
                        <h6>{this.props.title}</h6>
                        <button 
                            className="btn btn-icon btn-2 btn-link btn-sm" 
                            data-toggle="modal"
                            data-target={"#board-modal" + this.props.id}
                        >
                            <span className="btn-inner--icon"><i className="ni ni-settings-gear-65"></i></span>
                        </button>
                        <button 
                            className="btn btn-icon btn-2 btn-danger btn-sm" 
                            onClick={this.handleRemoveBoard}
                        >
                            <span className="btn-inner--icon"><i className="ni ni-fat-remove"></i></span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});
const mapDispatchToProps = dispatch => ({
    dispatchCallRemoveBoard: (boardId) => dispatch(callRemoveBoard(boardId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);


