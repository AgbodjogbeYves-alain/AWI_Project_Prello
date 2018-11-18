import React, {Component} from 'react';
import NavBar from "../../partials/NavBar";
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import asteroid from '../../../common/asteroid';



class Stats extends Component {

    constructor(props) {
        super(props);

        this.state = {
            board: this.props.boards[0],
            nbCardsActive: 0,
            nbCardsArchived: 0,
        }

        this.handleBoardChange = this.handleBoardChange.bind(this);
        this.countCards = this.countCards.bind(this);
        this.countCardsArchived = this.countCardsArchived.bind(this);
    }

    handleBoardChange = (event) => {
        event.preventDefault()
        let boardId = event.target.value;
        let newBoard = this.props.boards.filter(board => board._id == boardId)[0];
        let newNbCardsActives = this.countCards(newBoard);
        let newNbCardsArchived = this.countCardsArchived(newBoard);
        this.setState({board: newBoard, nbCardsActive: newNbCardsActives, nbCardsArchived: newNbCardsArchived});
    }

    componentDidMount(){
        let countCardActive = this.countCards(this.state.board);
        let countCardArchived = this.countCardsArchived(this.state.board);
        this.setState({nbCardsActive: countCardActive, nbCardsArchived: countCardArchived});
    }

    countCards(board) {
        let c=0;
        board.boardLists.map(list => {(c=c+list.listCards.length)});
        return(c);
    }

    countCardsArchived(board) {
        let cardList = board.boardLists.map(list => list.listCards);
        let cards = cardList.flat();
        let cardsArchived = cards.filter(card => card.isArchived)
        let c = cardsArchived.length
        return(c);
    }

    render(){
        const { user } = this.props;
        if(!user) return(<Redirect to='/'/>)
        return(
            <main id="stats">
                <NavBar/>
                <div className="container" style={{marginTop:"75px"}}>
                    <div className="row">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label class="input-group-text" for="inputGroupSelect01">Board</label>
                            </div>
                            <select class="custom-select" id="inputGroupSelect01" onChange={this.handleBoardChange}>
                            {
                                this.props.boards.map(board => {
                                    return (
                                        <option key={"option"+board._id} value={board._id}>
                                            {board.boardTitle}
                                        </option>
                                    );
                                })
                            }
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="card card-stats mb-4 mb-lg-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <h5 className="card-title text-uppercase text-muted mb-0">Number of users</h5>
                                        <span className="h2 font-weight-bold mb-0">{this.state.board.boardUsers.length}</span>
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                            <i className="ni ni-chart-bar-32"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card card-stats mb-4 mb-lg-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <h5 className="card-title text-uppercase text-muted mb-0">Number of lists</h5>
                                        <span className="h2 font-weight-bold mb-0">{this.state.board.boardLists.length}</span>
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                            <i className="ni ni-chart-bar-32"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card card-stats mb-4 mb-lg-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <h5 className="card-title text-uppercase text-muted mb-0">Total cards number</h5>
                                        <span className="h2 font-weight-bold mb-0">{this.state.nbCardsActive}</span>
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                            <i className="ni ni-chart-bar-32"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="card card-stats mb-4 mb-lg-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <h5 className="card-title text-uppercase text-muted mb-0">Number of archived cards</h5>
                                        <span className="h2 font-weight-bold mb-0">{this.state.nbCardsArchived}</span>
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                            <i className="ni ni-chart-bar-32"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card card-stats mb-4 mb-lg-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <h5 className="card-title text-uppercase text-muted mb-0">Number of archived lists</h5>
                                        <span className="h2 font-weight-bold mb-0">{this.state.board.boardLists.filter(list => list.listArchived).length}</span>
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                            <i className="ni ni-chart-bar-32"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    boards: state.boards,
    teams: state.teams
});
export default connect(mapStateToProps)(Stats);
