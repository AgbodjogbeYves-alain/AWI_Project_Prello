import NavBar from "../../partials/NavBar.js"
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Card from "./Card";

const Board = {
    id: '1',
    boardTitle: 'test',
    boardUser: {

    },
    privacyInt: 1,
    boardLists: [
        {
            id: 1,
            title: "testList",
            cards: [
                {
                    id: 1,
                    title: "cardTitle"
                },{
                    id: 2,
                    title: "cardTitle2"
                }
            ]
        }
    ]
};
export default class BoardDisplay extends Component {

    constructor(props) {
        super(props);
        let idBoard = this.props.match.params.id
        this.state = {
            board: ''
        };

        this.divId = {
            divId1: "div1",
            divId2: "div2"

        };


        this.createList = this.createList.bind(this)
    }


        componentDidMount(){
            let idBoard = this.props.match.params.id;
            Meteor.call('getBoard',{ idBoard },(error, result) => {
                if(error){
                }else{
                    console.log(result)
                    this.setState({
                        board: result
                    })
                }

            })
        };






    createList = () => {

    };

    render() {

        return(
            <main>
                <NavBar/>
                <button className={"btn btn-neutral btn-icon"} onClick={this.createListHandler}>Create List</button>
                <Card />

                <ul>{Board.boardLists.map(list => {return (<li key={list.id.toString()}>{list.id}</li>)})}</ul>


            </main>
            )
    }
}