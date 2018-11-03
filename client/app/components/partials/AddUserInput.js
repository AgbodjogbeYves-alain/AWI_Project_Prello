import React, { Component } from 'react';
import asteroid from '../../common/asteroid';

export default class AddUserInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            boardUsers: this.props.boardUsers,
            userEmail: "",
            userRole: 1,
            alerts: []
        };
    }

    renderUsers(){
        return this.state.boardUsers.map((u,i) => 
            <div className="row" key={i}>
                <div className="col-7">
                    {u.user.profile.email}
                </div>
                <div className="col-3">
                    <select 
                        className="mb-3" 
                        value={u.userRole} 
                        onChange={(e) => this.handleChangeUserRole(u, e.target.value)}
                    >
                        <option value={1}>Admin</option>
                        <option value={2}>User</option>
                        <option value={3}>Observer</option>
                    </select>
                </div>
                <div className="col-2">
                    <button className="btn btn-danger btn-sm" onClick={() => this.handleRemoveUser(u.user._id)}>
                        x
                    </button>
                </div>
            </div>
        )
    }

    handleRemoveUser(userId){
        let newBoardUsers = this.state.boardUsers.filter((u) => u.user._id != userId);
        this.setState({boardUsers: newBoardUsers});
        this.onChange();
    }

    handleAddUser(){
        let boardUsers = this.state.boardUsers;
        let alreadyUser = this.state.boardUsers.filter((u) => u.user.profile.email == this.state.userEmail);
        if(alreadyUser.length > 0) alert("This user has been already put.")
        else {
            asteroid.call('users.getUser', this.state.userEmail)
            .then((result) => {
                if(result){
                    boardUsers.push({
                        user: result,
                        userRole: this.state.userRole
                    });
                    this.setState({boardUsers: boardUsers});
                    this.setState({userEmail: ''});
                    this.onChange();
                }
                else this.addAlert("danger", "No user with this email.")
            })
            .catch((error) => alert(error.reason));
        } 
    }

    onChange(){
        this.props.onChange('boardUsers', this.props.boardUsers);
    }

    handleChangeUserRole(boardUser, userRole){
        let newBoardUsers = this.state.boardUsers.map((u) => {
            if(u.user._id == boardUser.user._id){
                u.userRole = userRole
                return u
            } 
            else return u
        })

        this.setState({boardUsers: newBoardUsers});
        this.onChange();
    }

    render(){
        return (
            <div className="form-group mb-3">
                {this.renderUsers()}
                <div className="row">
                    <div className="col-6">
                        <div className="input-group input-group-alternative">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                            </div>
                            <input 
                                className="form-control" 
                                placeholder="Email" 
                                type="email"
                                value={this.state.userEmail}
                                onChange={(e) => this.setState({userEmail: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="col-3" style={{paddingTop: "11px"}}>
                        <select 
                            className="mb-3" 
                            valus={this.state.userRole} 
                            onChange={(e) => this.setState({userRole: e.target.value})}
                        >
                            <option value={1}>Admin</option>
                            <option value={2}>User</option>
                            <option value={3}>Observer</option>
                        </select>
                    </div>
                    <div className="col-3">
                        <button className="btn btn-primary" onClick={() => this.handleAddUser()}>Add</button>
                    </div>
                </div>
            </div>
        )
    }
}