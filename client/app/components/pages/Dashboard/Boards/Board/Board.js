import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import asteroid from '../../../../../common/asteroid';

class Board extends Component {

    constructor(props) {
        super(props);

        this.handleRemoveBoard = this.handleRemoveBoard.bind(this);
    }

    handleRemoveBoard(){
        if(confirm("Are you sure to delete this board ?")){
            asteroid.call("boards.removeBoard", this.props.board._id)
        }
    }
    render(){
        console.log("test")
        let board = this.props.board;
        return(
            <div to={"/board/"+ board._id} className="col-3 board-card">
                <Link 
                    to={"/board/"+ board._id} 
                    className="card card-stats mb-4 mb-lg-0"
                    style={{backgroundImage: "url('https://res.cloudinary.com/dxdyg7b5b/image/upload/c_thumb,w_300/v1541680096/backgrounds/"+ board.boardBackground +".jpg')"}}
                >
                    <div className="card-body">
                        <h6>{board.boardTitle}</h6>
                        <div class="dropdown float-right d-none">
                            <a class="btn-link btn-sm" data-toggle="dropdown" href="#" role="button">
                                <i class="ni ni-settings-gear-65 ni-lg"></i>
                            </a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" 
                                    data-toggle="modal"
                                    data-target={"#board-modal" + board._id}
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
                </Link>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(Board);


