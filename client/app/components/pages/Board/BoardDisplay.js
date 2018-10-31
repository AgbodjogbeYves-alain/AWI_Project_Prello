import NavBar from "../../partials/NavBar.js"
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from "styled-components";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import List from "./List";
import NavBarBoard from "../../partials/NavBarBoard";
import asteroid from "../../../common/asteroid.js";
const Container = styled.div`
  display: flex;
`;

export default class BoardDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            board: {},
            list: []
        }
        ;

        this.onDragEnd = this.onDragEnd.bind(this);

        this.createList = this.createList.bind(this)

        this.createCard = this.createCard.bind(this)
    }


    componentDidMount(){
        let idBoard = this.props.id;
        let boardFromDB = {}
        let listFromDB = []
        asteroid.call('getBoard',{ idBoard })
            .then(result => {
                boardFromDB = result,
                listFromDB = result.boardList
                this.setState({
                    board: boardFromDB,
                    list: listFromDB
                })
            }).catch(error => {
                alert(error);
        })
    }

    onDragEnd = result => {
        const { destination, source, draggableId, type } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if(type==="list"){
            const idForListToMove = draggableId.slice(10)
            console.log(idForListToMove)
            const listToMove = this.state.list.filter((list) => list.listId == idForListToMove)[0];
            const newLists = Array.from(this.state.list);

            newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, listToMove);

            const newState = {
                ...this.state,
                list: newLists
            };
            this.setState(newState);
            return;
        }

        const start = this.state.list.filter((list) => list.listId == source.droppableId.slice(6))[0];

        const finish = this.state.list.filter((list) => list.listId == destination.droppableId.slice(6))[0];

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
            const newList = Array.from(this.state.list.map((listIn) => {
                if(listIn.listId == newStart.listId){
                    return newStart
                }else{
                    return listIn
                }
            } ))

            const newState = {
                ...this.state,
                list: newList
            };

            this.setState(newState)

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
            let newList = Array.from(this.state.list.map((listIn) => {
                if(listIn.listId == newStart.listId){
                    return newStart
                }else{
                    return listIn
                }
            } ))

            console.log(newList)
            const finalList = Array.from(newList.map((listIn)=>{
                if(listIn.listId == newFinish.listId){
                    return newFinish
                }else{
                    return listIn
                }
            }))

            console.log(finalList)
            const newState = {
                ...this.state,
                list: finalList
            };

            console.log(newState)
            this.setState(newState)


        }
    };

    createList = () => {
        asteroid.call('createList',"New List")
            .then(result => {
                let nlist = {listId:result, listTitle:"New List", listCard: [], listCreatedAt: Date()}; //see if keep like it
                this.state.list.push(nlist);
                let newState = {
                    board: this.state.board,
                    list: this.state.list
                };
                console.log(this.state);
                this.setState(newState);
            }).catch(error => {
                alert(error);
        })
    };


    createCard = () => {

    }
    render() {

    return(
        <div id={"boardDisplay"}>
            <NavBar/>
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId={"all-columns"} direction={"horizontal"} type={"list"}>
                    {(provided)=> {
                        return(
                            <Container
                                {...provided.droppableProps}
                                ref={provided.innerRef}

                            >
                                {this.state.list.map((list,index) => {
                                    const cards = list.listCard;
                                    return <List key={list.listId} list={list} index={index} cards={cards}/>;
                                })}

                                {provided.placeholder}
                            </Container>
                        )}}
                </Droppable>
            </DragDropContext>
            <button className="btn btn-success" onClick={this.createList}>Create a new List</button>
        </div>
        )
    }
}