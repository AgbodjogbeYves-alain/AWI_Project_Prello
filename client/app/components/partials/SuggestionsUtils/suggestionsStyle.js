export const theme = {
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
      padding: '1px 20px',
      margin : "1px 0"
    },
    suggestionHighlighted: {
      backgroundColor: '#ddd'
    },
    
  };