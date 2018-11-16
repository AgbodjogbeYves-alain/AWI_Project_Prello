import React from 'react'
import {ContainerC} from "../../pages/Utils/Utils";

//calculate suggestions for any given input value
const getBoardsSuggestions = (query,boards) => {
    const inputValue = query.trim().toLowerCase();
    const inputLength = inputValue.length;
   
    return inputLength === 0 ? [] : boards.filter(board =>
      board.boardTitle.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

const getCardsSuggestions = (query,cards,board,list) => {
    const inputValue = query.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0  ? [] : cards.filter(card => {
            if (card.cardTitle.toLowerCase().slice(0, inputLength) === inputValue)
            {
                card.board = board;
                card.list = list
                return card
            }
            
        }
        
    );
};

const getSunggestions = (query,boards) => {
    
    const boardsSuggestions =  getBoardsSuggestions(query,boards);
    let cardsSuggestions = []
    
    boards.forEach(b =>{
        if(b.boardLists)
        {
            b.boardLists.forEach(l =>{
                cardsSuggestions = cardsSuggestions.concat(getCardsSuggestions(query,l.listCards,b,l));
            })
            
        }
            
    });

    const suggestions = boardsSuggestions.concat(cardsSuggestions)
    return suggestions
}

  //calculate the input value for every given suggestion for when a suggestion is clicked
const getSuggestionValue = suggestion => {
    if(suggestion.boardTitle)
        return suggestion.boardTitle;
    else if(suggestion.cardTitle)
        return suggestion.cardTitle;
}
    //boardSuggestion._id,
    
    //boardSuggestion.boardBackground,
    //boardSuggestion.boardDescription

const renderBoardSuggestions = boardSuggestion => {
   //style={{marginBottom: "-17"}}
    return (
    <div>
       <div style={{display: "inline-block", verticalAlign:"top", marginRight:"10",width:"25%"}}>
        <img src= {"https://res.cloudinary.com/dxdyg7b5b/image/upload/c_thumb,w_300/"+ boardSuggestion.boardBackground +".jpg"}
            height="35"
            
        />
        </div>
        <div  style={{display: "inline-block",width:"69%"}}>
            <h5 style={{textOverflow:"ellipsis",width:"100%",overflow:"hidden",whiteSpace:"nowrap"}}>{boardSuggestion.boardTitle}</h5>
            <p style={{textOverflow:"ellipsis",width:"100%",overflow:"hidden",whiteSpace:"nowrap"}}>{boardSuggestion.boardDescription}</p>  
        </div>
        
    </div>)
}

const renderCardSuggestion = (cardSuggestion,cardLabels) => {
    return (
        <div >
            <div style={{display: "inline-block", verticalAlign:"top",width:"36%",marginRight:"10" }}>
            <ContainerC style={{height:"35", overflow: "visible"}}>

                        <h5 style={{textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap",textAlign:"top",fontSize:"15"}}>{cardSuggestion.cardTitle}</h5>
                        <div className={"cardLabelsDiv"}>
                            {cardLabels.map((label) => {
                                
                                return <span className="badge badge-pill badge-default" style={{background: label.labelColor}}>{label.labelName}</span>
                            })}
                        </div>
                    </ContainerC>
                    </div>
            <div  style={{display: "inline-block",width:"59%"}}>
                <h5 style={{textOverflow:"ellipsis",width:"100%",overflow:"hidden",whiteSpace:"nowrap"}}>{cardSuggestion.cardTitle}</h5>
                <p style={{textOverflow:"ellipsis",width:"100%",overflow:"hidden",whiteSpace:"nowrap",fontSize:"15"}}>Dans <strong>{cardSuggestion.board.boardTitle}</strong> sur <strong>{cardSuggestion.list.listTitle}</strong></p>  
            </div>
            
        </div>)
}

const renderSuggestion = (suggestion,cardLabels) => {
    if(suggestion.boardTitle)
        return renderBoardSuggestions(suggestion)
    else if(suggestion.cardTitle)
    {
        let labels =  cardLabels.filter((label) => suggestion.cardLabels.includes(label._id) )
        return renderCardSuggestion(suggestion,labels)
    }
       
}

module.exports = {
    getSuggestionValue,
    getSunggestions,
    renderSuggestion
}


   