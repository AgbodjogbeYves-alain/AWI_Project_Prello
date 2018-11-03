import React, { Component,PureComponent } from 'react';
import {callEditBoard, callRemoveBoard} from "../../actions/BoardActions";


export default class Menu extends Component {
    constructor(props){
        super(props)
        this.state = {
            level: 0,
            idBoard: ''
        }

        this.handleCloseBoard = this.handleCloseBoard.bind(this)
    }

    handleCloseBoard = (event) =>{
        const { dispatchCallRemoveBoard } = this.props;
        dispatchCallRemoveBoard(this.state.idBoard)
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            idBoard: nextProps.idBoard,
        })
    }
    render(){
        return (
            <div id="mySidenav" className="sidenav">
                <h3>Menu</h3>
                <a href="#"><i className={"ni ni-book-bookmark"}/> Filter cards</a>
                <a href="#"><i className={"ni ni-settings"}/> Parameters</a>
                <a href="#"><i className={"ni ni-tag"}/> Tags</a>
                <a href="#"><i className={"ni ni-box-2"}/> Archived elements</a>
                <a href="#"><i className={"ni ni-glasses-2"}/> Follow board</a>
                <a href="#"><i className={"ni ni-single-copy-04"}/> Copy board</a>
                <a href="#" onClick={this.handleCloseBoard}>Close board</a>
                <a href="#"><i className={"ni ni-spaceship"}/> Leave the board</a>*
            </div>


        )
    }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
    dispatchCallRemoveBoard: (idBoard) => dispatch(callRemoveBoard(idBoard)),
});