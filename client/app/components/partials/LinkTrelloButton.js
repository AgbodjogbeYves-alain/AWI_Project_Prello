import React, { Component } from 'react';
import asteroid from '../../common/asteroid.js';

export default class LinkTrelloButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            trelloLinked: !!this.props.trelloToken
        }
    }

    handleClickLinkTrello(){
        let that = this;
        Trello.authorize({
            name: "Prello",
            type: "popup",
            success: function(val){
                let token = Trello.token();
                that.setState({"trelloLinked": true})
                asteroid.call("users.linkTrello", token);
            }
        })
    }

    handleClickUnlinkTrello(){
        Trello.deauthorize();
        this.setState({"trelloLinked": false});
        asteroid.call("users.unlinkTrello");
    }

    render(){
        if(this.props.trelloToken){
            return(
                <button 
                    onClick={() => this.handleClickUnlinkTrello()}
                    className="btn btn-primary btn-sm">
                    Unlink Trello account
                </button>
            )
        }
        return (
            <button 
                onClick={() => this.handleClickLinkTrello()}
                className="btn btn-primary btn-sm">
                Link Trello account
            </button>
        )
    }
}

