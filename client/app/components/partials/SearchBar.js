import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest';
import suggestionsUtil from './SuggestionsUtils/SuggestionsUtils'
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import {theme} from './SuggestionsUtils/suggestionsStyle'
import ModalEditCard from './ModalEditCard';


 class SearchBar extends Component {

    constructor(props){
        super(props)

        this.state = {
            query: '',
            suggestions: []
        }

        this.updateSearch = this.updateSearch.bind(this)
    }

    updateSearch(event){
        event.preventDefault()
        this.setState({
            query: event.target.value
        })
    }


     // Autosuggest will call this function every time you need to update suggestions.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
        suggestions: suggestionsUtil.getSunggestions(value,this.props.boards),
        });        
    };

     // Autosuggest will call this function every time you need to clear suggestions.
   onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
        
    };

    onSuggestionSelected = (event,{suggestion,suggestionValue,method}) => {
        
       if(suggestion.boardTitle)
       {
        this.setState({
            query: suggestion.boardTitle
        })
        this.props.history.push("/board/"+ suggestion._id)
       }
         
       else if(suggestion.cardTitle){
        this.setState({
            query: suggestion.cardTitle
        })
            let boardId = suggestion.board._id;
            
            this.props.history.push("/board/"+ boardId,{card: suggestion})
            
        }
    }

    
    render() {
        //const { value, suggestions } = this.state;
 
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
          placeholder: 'Search',
          value: this.state.query,
          onChange: this.updateSearch
        };
        return(
           
            <div className="col-md-6" id="searchBar">
                <div className="form-group">
                <div className="input-group mb-4">
                        <Autosuggest 
                            suggestions={this.state.suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={suggestionsUtil.getSuggestionValue}
                            renderSuggestion={(suggestopn) => suggestionsUtil.renderSuggestion(suggestopn,this.props.labels)}
                            inputProps={inputProps}
                            theme={theme}
                            onSuggestionSelected= {this.onSuggestionSelected}
                        />
                       {/*
                      
                        <input value={this.state.query}
                               onChange={this.updateSearch} 
                               className="form-control" 
                               placeholder="Search" type="text" />

                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="ni ni-zoom-split-in"></i></span>
                        </div>
                        */
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    boards: state.boards,
    labels: state.labels
});

export default connect(mapStateToProps)(withRouter(SearchBar));

