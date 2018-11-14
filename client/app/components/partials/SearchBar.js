import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest';
import suggestionsUtil from './SuggestionsUtils/boardsSuggestionsUtils'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

//import {theme} from '../../../public/assets/css/suggestionsTheme.css';


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
        suggestions: suggestionsUtil.getBoardsSuggestions(value,this.props.boards),
        });
    };

     // Autosuggest will call this function every time you need to clear suggestions.
   onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionSelected = (event,{suggestion,suggestionValue}) => {
      
        /*return <Link 
             to={"/board/"+ suggestion._id} 
        />*/
    }

    
    render() {
        const theme = {
            container: {
              position: 'relative',
            },
            input: {
              width: 240,
              height: 30,
              padding: '10px 20px',
              fontFamily: 'Helvetica, sans-serif',
              fontWeight: 300,
              fontSize: 20,
              border: '1px solid #aaa',
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
            },
            inputFocused: {
              outline: 'none'
            },
            inputOpen: {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            },
            suggestionsContainer: {
              display: 'none'
            },
            suggestionsContainerOpen: {
              display: 'block',
              position: 'absolute',
              top: 35,
              width: 280,
              border: '1px solid #aaa',
              backgroundColor: '#fff',
              fontFamily: 'Helvetica, sans-serif',
              fontWeight: 300,
              fontSize: 16,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
              zIndex: 2,
            },
            suggestionsList: {
              margin: 0,
              padding: 0,
              listStyleType: 'none',
              maxHeight: 300,
              overflowY: "scroll"
            },
            suggestion: {
              cursor: 'pointer',
              padding: '10px 20px'
            },
            suggestionHighlighted: {
              backgroundColor: '#ddd'
            },
            
          };
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
                            renderSuggestion={suggestionsUtil.renderBoardSuggestions}
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
});

export default connect(mapStateToProps)(SearchBar);

