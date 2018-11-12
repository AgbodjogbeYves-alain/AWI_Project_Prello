import NavBar from "../../partials/NavBar.js"
import React, { Component } from 'react';
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import List from "./List";
import NavBarBoard from "../../partials/NavBarBoard";

import { connect } from 'react-redux';
import {callEditBoard} from "../../../actions/BoardActions";
import {ContainerB} from "../Utils/Utils";
import {callCreateList} from "../../../actions/ListActions";


class BoardDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            board: null
        }

        this.onDragEnd = this.onDragEnd.bind(this);
        this.createList = this.createList.bind(this)
    }

    componentDidMount(){
        let id = this.props.match.params.id
        let board = this.props.boards.filter((board) => board._id === id)[0]
        if(board !== undefined){
            this.setState({
                board: board,
            })
        }else{
            this.setState({
                board: 'unknow',
            })

        }
    }


    componentWillReceiveProps(nextProps){
        console.log("test")
        let id = nextProps.match.params.id
        let board = nextProps.boards.filter((board) => board._id === id)[0]
        if(board !== undefined){
            this.setState({
                board: board,
            })
        }else{
            this.setState({
                board: 'unknow',
            })

        }
    }

    onDragEnd = result => {
        const { destination, source, draggableId, type } = result;

        const currentLists = this.state.board.boardLists

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if(type==="list"){
            const idForListToMove = draggableId.slice(10)
            const listToMove = currentLists.filter((list) => list._id == idForListToMove)[0];

            const newLists = Array.from(this.state.board.boardLists);

            newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, listToMove);
            let newBoard = this.state.board
            newBoard.boardLists = newLists
            const newState = {
                board: newBoard
            };

            this.setState(newState);

            //Dispatch
            callEditBoard(newBoard)


        }else{
            const start = currentLists.filter((list) => list._id == source.droppableId.slice(6))[0];

            const finish = currentLists.filter((list) => list._id == destination.droppableId.slice(6))[0];

            if(start === finish){
                ///////////////////////////////////////////////
                const newCardsList = Array.from(start.listCard);

                const cardToMove = newCardsList.filter((card) => card._id == draggableId)[0];
                newCardsList.splice(source.index, 1);
                newCardsList.splice(destination.index, 0, cardToMove);

                const newStart = {
                    ...start,
                    listCard: newCardsList
                };

                ///////////////////////////////////////////////
                const newList = Array.from(currentLists.map((listIn) => {
                    if(listIn._id == newStart._id){
                        return newStart
                    }else{
                        return listIn
                    }
                } ))

                let newBoard = this.state.board
                newBoard.boardLists = newList

                const newState = {
                    board: newBoard
                };

                this.setState(newState)
                //Dispatch
                callEditBoard(newBoard)


            }else {

                //Move from a list to another
                const startCards = Array.from(start.listCard)
                const cardToMove = startCards.filter((card) => card._id == draggableId)[0];

                startCards.splice(source.index, 1);

                const newStart = {
                    ...start,
                    listCard: startCards,

                }

                const finishedCards = Array.from(finish.listCard)
                finishedCards.splice(destination.index, 0, cardToMove);

                const newFinish = {
                    ...finish,
                    listCard: finishedCards
                };

                ///////////////////////////////////////////////
                let newList = Array.from(this.state.board.boardLists.map((listIn) => {
                    if(listIn._id == newStart._id){
                        return newStart
                    }else{
                        return listIn
                    }
                } ))

                const finalList = Array.from(newList.map((listIn)=>{
                    if(listIn._id == newFinish._id){
                        return newFinish
                    }else{
                        return listIn
                    }
                }))

                let newBoard = this.state.board
                newBoard.boardLists = finalList


                const newState = {
                    board: newBoard
                };

                this.setState(newState)
                //Dispatch
                callEditBoard(newBoard)



            }
        }
    };

    createList = () => {
        callCreateList(this.state.board._id)
    };

    render() {

        return this.state.board && this.state.board != 'unknow' ? (
            <div
                id={"boardDisplay"}
                style={{backgroundImage: "url('https://res.cloudinary.com/dxdyg7b5b/image/upload/v1541680009/backgrounds/"+ this.state.board.boardBackground +".jpg')"}}
            >
                <NavBar/>
                <NavBarBoard board={this.state.board}/>
                <button className="btn btn-success myAddListButton" onClick={this.createList}>Create a new List</button>
                <div id={"divList"}>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId={"all-columns"} direction={"horizontal"} type={"list"}>
                            {(provided) => {
                                return (
                                    <ContainerB
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}

                                    >
                                        {
                                            this.state.board.boardLists.map((list, index) => {
                                                if(!list.listArchived){
                                                    const cards = list.listCards;
                                                    return (
                                                        <div key={'div'+list._id}>
                                                        <List key={list._id} list={list} index={index}
                                                              cards={cards} board={this.state.board}/>
                                                        </div>
                                                    );
                                                }
                                            })}

                                        {provided.placeholder}
                                    </ContainerB>
                                )
                            }}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        ) : (
            <div id={"unknowDisplayBoard"}>
                <NavBar/>
                <div className={"bigMessage"} id={'unknown'}>
                    <h1> Unreachable board</h1>
                    <p> Two things can create this error. Maybe this board is private or this board doesn't exist</p>
                </div>
            </div>

            )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    boards: state.boards,
    labels: state.labels
});

export default connect(mapStateToProps)(BoardDisplay);