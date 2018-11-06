import React, {Component} from 'react';
import { connect } from 'react-redux';

import { callRemoveBoard } from '../../../../../actions/BoardActions';
import asteroid from '../../../../../common/asteroid';

class Board extends Component {

    constructor(props) {
        super(props);

        this.handleRemoveBoard = this.handleRemoveBoard.bind(this);
    }

    handleRemoveBoard(){
        if(confirm("Are you sure to delete this board ?")){
            asteroid.call("boards.removeBoard", this.props.id)
        }
    }

    render(){
        return(
            <div className="col-3 board-card">
                <div className="card card-stats mb-4 mb-lg-0">
                    <div className="card-body">
                        <h6>{this.props.title}</h6>
                        <div class="dropdown float-right d-none">
                            <a class="btn-link btn-sm" data-toggle="dropdown" href="#" role="button">
                                <i class="ni ni-settings-gear-65 ni-lg"></i>
                            </a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" 
                                    data-toggle="modal"
                                    data-target={"#board-modal" + this.props.id}
                                >
                                    <i class="ni ni-settings"></i>
                                    Edit
                                </a>
                                <a class="dropdown-item" onClick={this.handleRemoveBoard}>
                                    <i class="ni ni-fat-remove"></i>
                                    Remove
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(Board);


