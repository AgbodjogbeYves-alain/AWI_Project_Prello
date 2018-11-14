import React from 'react'

//calculate suggestions for any given input value
const getBoardsSuggestions = (query,boards) => {
    const inputValue = query.trim().toLowerCase();
    const inputLength = inputValue.length;
   
    return inputLength === 0 ? [] : boards.filter(board =>
      board.boardTitle.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  //calculate the input value for every given suggestion for when a suggestion is clicked
const getSuggestionValue = boardSuggestion => 
    //boardSuggestion._id,
    boardSuggestion.boardTitle
    //boardSuggestion.boardBackground,
    //boardSuggestion.boardDescription
;

const renderBoardSuggestions = boardSuggestion => {
   
    return (
    <div style={{marginBottom: "-17"}}>
       <div style={{display: "inline-block", verticalAlign:"top", marginRight:"10"}}>
        <img src= {"https://res.cloudinary.com/dxdyg7b5b/image/upload/v1541680009/backgrounds/"+ boardSuggestion.boardBackground +".jpg"}
            height="35"
            
        />
        </div>
        <div  style={{display: "inline-block",}}>
            <h5 style={{textOverflow:"ellipsis",width:"150",overflow:"hidden",whiteSpace:"nowrap"}}>{boardSuggestion.boardTitle}</h5>
            <p style={{textOverflow:"ellipsis",width:"150",overflow:"hidden",whiteSpace:"nowrap"}}>{boardSuggestion.boardDescription}</p>  
        </div>
        
    </div>)
}

module.exports = {
    getBoardsSuggestions,
    getSuggestionValue,
    renderBoardSuggestions
}


   