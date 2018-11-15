import React, { Component,PureComponent } from 'react';
import Menu from "./Menu"
import {callEditBoard} from "../../actions/BoardActions";
import { connect } from 'react-redux';
import { ProfilePicture } from './ProfilePicture';

class NavBarBoard extends Component {

    constructor(props){
        super(props);
        this.state = {
            board:{boardTeams: []},
            teamsB: ["Personal"],
            newBoardName: '',
            visibleMenu: false
        }

        this.handleSubmitTitle = this.handleSubmitTitle.bind(this)
        this.handleBNChange = this.handleBNChange.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        let theBoard = nextProps.board

        if(theBoard !== undefined){
            let teamsB = ["Personal"];
            if(!(theBoard.boardTeams.length === 0)){
                if(theBoard.boardTeams.length > 1){
                    teamsB = ["Multiple teams"]
                }else{
                    teamsB = [theBoard.boardTeams[0].teamName]
                }
            }

            this.setState({
                board: theBoard,
                teams: teamsB
            })
        }else{
            this.setState({
                board: 'unknow',
            })
        }
    }

    toggleMenu = () =>{
        const { visibleMenu } = this.state
        this.setState({visibleMenu: !visibleMenu})
    }


    handleBNChange = (event) => {
        event.preventDefault()
        this.setState({ newBoardName: event.target.value});


    }
    handleSubmitTitle = (event) => {
        event.preventDefault()
        let newBoard = this.state.board
        newBoard.boardTitle = this.state.newBoardName
        this.setState({
            board: newBoard
        })

        callEditBoard(newBoard)
    }

    handlePrivacyChange = (event) => {
        event.preventDefault()
        let newBoard = this.state.board
        newBoard.boardPrivacy = event.target.value
        console.log(event.target.value)
        this.setState({
            board: newBoard
        })

        callEditBoard(newBoard)
    }

    renderProfilePictures(){
        return this.props.board.boardUsers.map((boardUser) => {
            let user = null;
            if(this.props.user._id === boardUser.userId) user = this.props.user;
            else user = this.props.users.filter((u) => u._id === boardUser.userId)[0];
            return (
                <div className="d-inline-block" style={{marginLeft: '5px'}}>
                    <ProfilePicture user={user} size={"sm"} />
                </div>
            )
        });
    }

    render(){
        return (

            <div id="navBarBoard">
            <nav className="navbar navbar-expand-lg navbar-dark">
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modalChangeBN">
                    {this.props.board.boardTitle}
                </button>

                <select className="btn btn-primary" defaultValue={(this.state.board.boardPrivacy===0)? 0: 1} onChange={this.handlePrivacyChange}>
                    <option value={0}> Public</option>
                    <option value={1}> Private</option>
                </select>

                <div className="board-users">
                    {this.renderProfilePictures()}
                </div>

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
    users: state.users,
    boards: state.boards
});
export default connect(mapStateToProps)(NavBarBoard);