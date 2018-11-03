import NavBar from "../../partials/NavBar.js"
import React, { Component } from 'react';
import styled from "styled-components";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import List from "./List";
import NavBarBoard from "../../partials/NavBarBoard";
import asteroid from "../../../common/asteroid.js";
import { connect } from 'react-redux';
import Dashboard from "../Dashboard/Dashboard";


const Container = styled.div`
  display: flex;
`;

class BoardDisplay extends Component {

    constructor(props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);

        this.createList = this.createList.bind(this)

        this.createCard = this.createCard.bind(this)
    }


    componentDidMount(){
        let idBoard = this.props.match.params.id;
        let boardFromDB = {}
        asteroid.call('board.getBoard', idBoard )
            .then(result => {
                boardFromDB = result
                this.setState({
                    board: boardFromDB
                })
            }).catch(error => {
                this.setState({
                    board: "unknown"
                })
            console.log(error);
        })
    }

    onDragEnd = result => {
        const { destination, source, draggableId, type } = result;

        const currentLists = this.state.board.boardList

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if(type==="list"){
            const idForListToMove = draggableId.slice(10)
            const listToMove = currentLists.filter((list) => list.listId == idForListToMove)[0];
            const newLists = Array.from(this.state.board.boardList);

            newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, listToMove);
            let newBoard = this.state.board
            newBoard.boardList = newLists
            const newState = {
                board: newBoard
            };

            //Dispatch
            const { dispatchCallEditBoard } = this.props;
            dispatchCallEditBoard(newBoard)


            this.setState(newState);
        }else{
            const start = currentLists.filter((list) => list.listId == source.droppableId.slice(6))[0];

            const finish = currentLists.filter((list) => list.listId == destination.droppableId.slice(6))[0];

            if(start === finish){
                ///////////////////////////////////////////////
                const newCardsList = Array.from(start.listCard);

                const cardToMove = newCardsList.filter((card) => card.cardId == draggableId)[0];
                newCardsList.splice(source.index, 1);
                newCardsList.splice(destination.index, 0, cardToMove);

                const newStart = {
                    ...start,
                    listCard: newCardsList
                };

                ///////////////////////////////////////////////
                const newList = Array.from(currentLists.map((listIn) => {
                    if(listIn.listId == newStart.listId){
                        return newStart
                    }else{
                        return listIn
                    }
                } ))

                let newBoard = this.state.board
                newBoard.boardList = newList

                const newState = {
                    board: newBoard
                };

                this.setState(newState)
                //Dispatch
                const { dispatchCallEditBoard } = this.props;
                dispatchCallEditBoard(newBoard)

            }else {

                //Move from a list to another
                const startCards = Array.from(start.listCard)
                const cardToMove = startCards.filter((card) => card.cardId == draggableId)[0];

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
                let newList = Array.from(this.state.board.boardList.map((listIn) => {
                    if(listIn.listId == newStart.listId){
                        return newStart
                    }else{
                        return listIn
                    }
                } ))

                const finalList = Array.from(newList.map((listIn)=>{
                    if(listIn.listId == newFinish.listId){
                        return newFinish
                    }else{
                        return listIn
                    }
                }))

                let newBoard = this.state.board
                newBoard.boardList = finalList


                const newState = {
                    board: newBoard
                };

                this.setState(newState)
                //Dispatch
                const { dispatchCallEditBoard } = this.props;
                dispatchCallEditBoard(newBoard)


            }
        }


    };

    createList = () => {
        asteroid.call('list.createList',"New List")
            .then((result) => {
                let nlist = {listId:result, listTitle:"New List", listCard: [], listCreatedAt: Date()}; //see if keep like it
                let lists = this.state.board.boardList
                lists.push(nlist)
                let newBoard = this.state.board
                newBoard.boardList = lists


                this.setState({
                    board: newBoard,
                });
            }).catch(error => {
            alert(error);
        })
    };


    createCard = () => {

    }
    render() {
        console.log(this.props)
        let board = this.props.boards.filter((board) => board.boardId == this.state.idBoard)
        console.log(board)
        return this.state.board != 'unknown' ? (
            <div id={"boardDisplay"}>
                <NavBar/>
                <NavBarBoard board={this.state.board}/>
                <div id={"divList"}>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId={"all-columns"} direction={"horizontal"} type={"list"}>
                            {(provided) => {
                                return (
                                    <Container
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}

                                    >
                                        {
                                            this.state.board.boardList.map((list, index) => {
                                                const cards = list.listCard;
                                                return <List key={list.listId} list={list} index={index}
                                                             cards={cards}/>;
                                            })}

                                        {provided.placeholder}
                                    </Container>
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
});

export default connect(mapStateToProps)(BoardDisplay);