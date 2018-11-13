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
            nbCards: 0,
        }

        this.handleBoardChange = this.handleBoardChange.bind(this);
        this.countCards = this.countCards.bind(this);
    }

    handleBoardChange = (event) => {
        event.preventDefault()
        let boardId = event.target.value;
        let newBoard = this.props.boards.filter(board => board._id == boardId)[0];
        let newNbCards = this.countCards(newBoard);
        this.setState({board: newBoard, nbCards: newNbCards});
    }

    componentDidMount(){
        let countCard = this.countCards(this.state.board);
        this.setState({nbCards: countCard});
    }

    countCards(board) {
        let c=0;
        board.boardLists.map(list => {(c=c+list.listCards.length)});
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
                        <select className="btn btn-primary" onChange={this.handleBoardChange}>
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
                        <div> {"Number of lists in the selected board : "+this.state.board.boardLists.length}</div>
                        <div> {"Number of users in the selected board : "+this.state.board.boardUsers.length}</div>
                        <div> {"Number of cards in the selected board : "+this.state.nbCards}</div>
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
