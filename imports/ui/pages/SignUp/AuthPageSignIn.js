import React, { Component } from 'react';
import axios from 'axios';

const panelStyle = {
    'max-width': '80%',
    margin: '0 auto'
}

class Register extends Component {
    constructor() {
        super();

        this.state = {
            formFields: {username: ''}
        }
    }

    render() {
        return(
            <div>
                <div class="panel panel-primary" style={panelStyle}>
                    <div class="panel panel-heading">Prello register page</div>
                    <div class="panel panel-body">
                        <form onSubmit={this.formHandler(this.state.formFields)}>
                            <strong>Username:</strong> <br /> <input type="text" name="username" placeholder="Nathaniel" onChange={(e) => this.inputChangeHandler.call(this, e)} value={this.state.formFields.username} /> <br />
                            <strong>Username:</strong> <br /> <input type="text" name="username" placeholder="Nathaniel" onChange={(e) => this.inputChangeHandler.call(this, e)} value={this.state.formFields.username} /> <br />
                            <strong>Username:</strong> <br /> <input type="text" name="username" placeholder="Nathaniel" onChange={(e) => this.inputChangeHandler.call(this, e)} value={this.state.formFields.username} /> <br />
                            <strong>Email:</strong> <br /> <input type="email" name="email" placeholder="me@example.com" /> <br />
                            <strong>Confirm Email:</strong> <br /> <input type="email" name="confirmemail" placeholder="me@example.com" /> <br />
                            <strong>Password:</strong> <br /> <input type="password" name="password" placeholder="********" /> <br />
                            <strong>Confirm Password:</strong> <br /> <input type="password" name="confirmpassword" placeholder="********" /> <br /><br />
                            <button class="btn btn-primary">Register Account</button>
                        </form>
                    </div>
                </div>
            </div>

        );
    }

    inputChangeHandler(e) {
        let formFields = {...this.state.formFields};
        formFields[e.target.name] = e.target.value;
        this.setState({
            formFields
        });
    }

    formHandler(formFields) {
        axios.post('/api/register', formFields)
            .then(function(response){
                console.log(response);
                //Perform action based on response
            })
            .catch(function(error){
                console.log(error);
                //Perform action based on error
            });
    }
}

export default Register