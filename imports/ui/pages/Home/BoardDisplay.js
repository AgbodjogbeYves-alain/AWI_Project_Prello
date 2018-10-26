import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Alert from "../../partials/Alert.js";
import NavBar from "../../partials/NavBar.js"
import queryString from 'query-string'

export default class BoardDisplay extends Component {

    constructor(props) {
        super(props);

        Meteor.call('getBoard',this.props.match.params.id,(error, result) => {
            console.log(result)
            if(error){
                this.props.history.push('/')
            }else{
                this.state = {
                    board: result
                }
            }

        })
    };


    render() {
        return(
            <td className="whiteSpaceNoWrap">{ this.state.board.privacy }</td>
            )
    }
}