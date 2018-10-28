import React, { Component } from 'react';
import NavBar from "../../partials/NavBar.js"

export default class BoardDisplay extends Component {

    constructor(props) {
        super(props);
        let idBoard = this.props.match.params.id
        this.state = {
            board: ''
        }
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


    render() {

        return(
            <div>
                <NavBar/>
                <span>LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOL</span>
            </div>
            )
    }
}