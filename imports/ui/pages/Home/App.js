import React, { Component } from 'react';
import { Link } from 'react-router-dom';
 
// App component - represents the whole app
export default class App extends Component {
    render() {
    return (
        <main>
            <div> Hello </div>
            <Link to='/login'>Log In</Link>
        </main>
    );
  }
}
