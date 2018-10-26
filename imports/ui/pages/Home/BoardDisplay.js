import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Alert from "../../partials/Alert.js";
import NavBar from "../../partials/NavBar.js"

export default class BoardDisplay extends Component {

    constructor(props) {
        super(props);
        let idBoard = this.props.match.params.id
        Meteor.call('getBoard',{ idBoard },(error, result) => {
            if(error){
                this.props.history.push('/signup')
            }else{
                this.state = {
                    board: result
                }
            }

        })
    };


    render() {

        return(
            <div>
                <NavBar/>
                <td className="whiteSpaceNoWrap">{ this.state.board.privacy }</td>
            </div>
            )
    }
}