import React, { Component } from 'react';
import { connect } from 'react-redux';

import LinkTrelloButton from '../../../partials/LinkTrelloButton.js';
import asteroid from '../../../../common/asteroid.js';

class ImportModal extends Component {

    constructor(props){
        super(props);

        this.state = {
            trelloBoards: [],
            trelloBoardId: null,
            loading: false
        }
    }

    getBoards(trelloToken){
        let that = this;
        if(trelloToken){
            Trello.setToken(trelloToken);
            Trello.get("/tokens/"+ trelloToken +"/member", (res) => {
                let trelloId = res.id
                Trello.get("/members/"+ trelloId +"/boards", (res => {
                    that.setState({trelloBoards: res});
                }))
            });
        }
    }

    componentDidMount(){
        let trelloToken = this.props.trelloToken;
        this.getBoards(trelloToken);
    }
    componentWillReceiveProps(nextProps){
        let trelloToken = nextProps.trelloToken;
        this.getBoards(trelloToken);
    }

    handleImport(){
        if(this.state.trelloBoardId){
            this.setState({loading: true});
            let that = this;

            let trelloBoard = this.state.trelloBoards.filter((b) => b.id === this.state.trelloBoardId)[0];
            Trello.get("/boards/"+ trelloBoard.id +"/lists", (lists) => {
                Trello.get("/boards/"+ trelloBoard.id +"/cards", (cards => {
                    cards.forEach((c) => {
                        let list = lists.filter((l) => l.id === c.idList)[0];
                        let card = {
                            _id: c.id,
                            cardTitle: c.name,
                            cardDescription: c.desc,
                            cardArchived: c.closed
                        }
                        if(list.listCards) list.listCards.push(card)
                        else list.listCards = [card]
                    })
                    trelloBoard.boardLists = lists.map((l) => {
                        return {
                            _id: l.id,
                            listTitle: l.name,
                            listCards: l.listCards,
                            listArchived: l.closed
                        }
                    })
                    
                    let finalBoard = {
                        boardTitle: trelloBoard.name,
                        boardDescription: trelloBoard.desc,
                        boardBackground: 'walnut',
                        boardUsers: [{userId: this.props.user._id, role: 'admin'}],
                        boardPrivacy: 0,
                        boardLists: trelloBoard.boardLists
                    }

                    asteroid.call("boards.createBoard", finalBoard)
                    .then(() => {
                        that.setState({loading: false});
                        $('#import-modal').modal('toggle');
                    })
                }))
            })
        }
        
    }

    render(){
        return ( 
            <div className="modal fade" id="import-modal" tabIndex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true">
                <div className="modal-dialog modal- modal-dialog-centered modal-" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h6 className="modal-title" id="modal-title-default">Import from another App</h6>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            {this.props.trelloToken ? 
                                <form>
                                    <label for="trello-select">Choose a Trello Board</label><br/>
                                    <select 
                                        id="trello-select" 
                                        value={this.state.trelloBoardId}
                                        onChange={(e) => this.setState({trelloBoardId: e.target.value})}
                                    >
                                        <option value={null}>Choose a board</option>
                                        {this.state.trelloBoards.map((b) => 
                                            <option value={b.id}>{b.name}</option>
                                        )}
                                    </select>
                                </form>
                                :
                                <LinkTrelloButton trelloToken={this.props.trelloToken} />
                            }
                            
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-link" data-dismiss="modal">Close</button>
                            {this.state.loading ?
                                <button className="btn btn-primary  ml-auto">
                                    Wait...
                                </button>
                                :
                                <button 
                                    className="btn btn-primary  ml-auto"
                                    onClick={() => this.handleImport()}>
                                    Import
                                </button>
                            }
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(ImportModal);