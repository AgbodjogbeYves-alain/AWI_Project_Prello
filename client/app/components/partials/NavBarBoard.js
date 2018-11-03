import React, { Component,PureComponent } from 'react';
import Menu from "./Menu"
import {callEditBoard} from "../../actions/BoardActions";
import { connect } from 'react-redux';

class NavBarBoard extends Component {

    constructor(props){
        super(props);
        this.state = {
            board:{},
            teamsB: ["Personal"],
            newBoardName: '',
            visibleMenu: false
        }

        this.handleSubmitTitle = this.handleSubmitTitle.bind(this)
        this.handleBNChange = this.handleBNChange.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        let teamsB = ["Personal"];
        console.log(nextProps)
        console.log(this.props)
        if(!(nextProps.board.boardTeam.length === 0)){
            if(nextProps.board.boardTeam.length > 1){
                teamsB = ["Multiple teams"]
            }else{
                teamsB = [nextProps.board.boardTeam[0].teamName]
            }
        }

        this.setState({
            board: nextProps.board,
            teams: teamsB
        })

    }

    toggleMenu = () =>{
        const { visibleMenu } = this.state
        this.setState({visibleMenu: !visibleMenu})
    }


    handleBNChange = (event) => {
        event.preventDefault()
        this.setState({ newBoardName: event.target.value});
        console.log(this.state.newBoardName)


    }
    handleSubmitTitle = (event) => {
        event.preventDefault()
        let newBoard = this.state.board
        newBoard.boardTitle = this.state.newBoardName
        this.setState({
            board: newBoard
        })

        console.log(this.state.board.boardTitle)
        const { dispatchCallEditBoard } = this.props;
        dispatchCallEditBoard(newBoard)
    }

    handlePrivacyChange = (event) => {
        event.preventDefault()
        let newBoard = this.state.board
        newBoard.boardPrivacy = event.target.value
        this.setState({
            board: newBoard
        })

        const { dispatchCallEditBoard } = this.props;
        dispatchCallEditBoard(newBoard)
    }


    render(){
        return (

            <div id="navBarBoard">
            <nav className="navbar navbar-expand-lg navbar-dark bg-default">
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modalChangeBN">
                    {this.state.board.boardTitle}
                </button>

                <select className="btn btn-primary" defaultValue={(this.state.board.boardPrivacy===0)? 0: 1} onChange={this.handlePrivacyChange}>
                    <option value={0}> Public</option>
                    <option value={1}> Private</option>
                </select>

                <button className={"btn btn-primary"} id={'toggleButton'} onClick={() => this.toggleMenu(true)}>
                    <span> <i className="ni ni-settings"/>Display settings</span>
                </button>
            </nav>
                {this.state.visibleMenu && <Menu idBoard={this.state.board._id}/>}
                <div className="modal fade" id="modalChangeBN" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Change board name</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form role="form" onSubmit={this.handleSubmitTitle}>
                                    <div className="form-group mb-3">
                                        <div className="form-group">
                                            <div className="input-group input-group-alternative">
                                                <input className="form-control" placeholder="Board name" type="text" value={this.state.newBoardName} onChange={this.handleBNChange}/>
                                            </div>
                                        </div>
                                    </div>
                                    <button className={"btn btn-primary"}>Change</button>
                                </form>
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
    boards: state.boards,
    board: {boardTeams: []}
});
    export default connect(mapStateToProps)(NavBarBoard);