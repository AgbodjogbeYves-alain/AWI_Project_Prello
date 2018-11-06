import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components'
import Card from "./Card";
import asteroid from '../../../common/asteroid';

const Container = styled.div`
  background-color: #d0d0d0;
  border-radius: 5px;
  box-shadow: 0px 0px 3px 1px #0000005c;
  display: flex;
  flex-direction: column;
  min-width: 250px;
  width: 15vw;
  margin-left: 7px;
  margin-right: 7px;
  margin-bottom: 20px;
  position: relative;
  box-sizing: border-box;
`;

const Title = styled.h3`
  padding: 8px;
`;
const CardList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? "lightgrey" : "inherit"};
  flex-grow: 1;
  min-height: 100px;
  
`;

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board:{},
            newListName: ''
        };
        this.handleSubmitTitle = this.handleSubmitTitle.bind(this);
        this.handleLNChange = this.handleLNChange.bind(this);
        this.sayClick = this.sayClick.bind(this)
    };

    componentDidMount(){
        let idBoard = this.props.id;
        let boardFromDB = {}
        asteroid.call('board.getBoard',{idBoard})
            .then(result => {
                boardFromDB = result
                this.setState({
                    board: boardFromDB
                })
            }).catch(error => {
                alert(error);
        })
    }

    handleSubmitTitle = (event) => {
        event.preventDefault()
        let newBoard = this.state.board;
        console.log(newBoard);
        newBoard.list.map(list => { if(list.listId == newList.listId){list.listTitle = this.state.newListName; return list} else {return list}})
        asteroid.call('baords.editBoard', newBoard)
            .then((result) => {
                this.setState({board: result});
            }).catch((error) => {
                console.log(error);
                alert(error);
            })
    }
    
    handleLNChange = (event) => {
        event.preventDefault()
        this.setState({ newListName: event.target.value});
    }

    sayClick = (event) =>{
        console.log('Coucou')
    }

    render() {
        return (
            <div>
            <div className="modal fade" id={"modalChangeLN"+this.props.list.listId} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Change list name</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form role="form" onSubmit={this.handleSubmitTitle}>
                                <div className="form-group mb-3">
                                    <div className="form-group">
                                        <div className="input-group input-group-alternative">
                                            <input className="form-control" placeholder="List name" type="text" value={this.state.newListName} onChange={this.handleLNChange}/>
                                        </div>
                                    </div>
                                </div>
                                <button className={"btn btn-primary"}>Change</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Draggable draggableId={"listDragId"+this.props.list.listId} index={this.props.index}>
                {(provided) => {
                    return (
                        <Container {...provided.draggableProps} ref={provided.innerRef}>
                        <Title {...provided.dragHandleProps}> Drag Here </Title>
                            <Title onClick={this.sayClick}>{this.props.list.listTitle}</Title>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id={"dropdownMenuButton"+this.props.list.listId} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="glyphicon glyphicon-option-vertical"></span>
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" data-toggle="modal" data-target={"#modalChangeLN"+this.props.list.listId}>Edit list name</a>
                                    <a className="dropdown-item" href="#">Add a card</a>
                                    <a className="dropdown-item" href="#">Copy list</a>
                                    <a className="dropdown-item" href="#">Move list</a>
                                    <a className="dropdown-item" href="#">Follow</a>
                                    <a className="dropdown-item" href="#">Archive all cards</a>
                                    <a className="dropdown-item" href="#">Archive list</a>
                                </div>
                            </div>
                            <Droppable droppableId={"listId"+this.props.list.listId} type={"card"}>
                                {(provided) => (
                                    <CardList ref={provided.innerRef} {...provided.droppableProps}>
                                        {this.props.cards.map((card, index) => <Card key={card.cardId} card={card}
                                                                                     index={index}/>)}
                                        {provided.placeholder}
                                    </CardList>
                                )
                                }

                            </Droppable>
                        </Container>
                    )}}
            </Draggable>
            </div>
        )
    }
}