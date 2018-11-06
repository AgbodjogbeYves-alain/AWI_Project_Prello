import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import asteroid from '../../common/asteroid';
import { connect } from 'react-redux';

class AddUserInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addedUsers: this.props.addedUsers,
            userEmail: "",
            userRole: 1,
            users: [],
            alerts: []
        };
    }

    renderUsers(){
        return this.state.addedUsers.map((u,i) => 
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
                        {this.renderRoleOptions()}
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
        let newAddedUsers = this.state.addedUsers.filter((u) => u.user._id != userId);
        this.setState({addedUsers: newAddedUsers});
        this.onChange();
    }

    handleAddUser(){
        let addedUsers = this.state.addedUsers;
        let alreadyUser = this.state.addedUsers.filter((u) => u.user.profile.email == this.state.userEmail);
        if(alreadyUser.length > 0) alert("This user has been already put.")
        else {
            asteroid.call('users.getUser', this.state.userEmail)
            .then((result) => {
                if(result){
                    addedUsers.push({
                        user: result,
                        userRole: parseInt(this.state.userRole)
                    });
                    this.setState({addedUsers: addedUsers});
                    this.setState({userEmail: ''});
                    this.onChange();
                }
                else this.addAlert("danger", "No user with this email.")
            })
            .catch((error) => alert(error.reason));
        } 
    }

    onChange(){
        this.props.onChange('addedUsers', this.props.addedUsers);
    }

    handleChangeUserRole(addedUser, userRole){
        let newAddedUsers = this.state.addedUsers.map((u) => {
            if(u.user._id == addedUser.user._id){
                u.userRole = userRole
                return u
            } 
            else return u
        })

        this.setState({addedUsers: newAddedUsers});
        this.onChange();
    }

    renderRoleOptions(){
        let optionList = [];
        if(this.props.type == "board") optionList = ['Admin', 'Member', 'Observer'];
        else if(this.props.type == "team") optionList = ['Admin', 'Member'];
        return optionList.map((o) => 
            <option value={o.toLowerCase()}>{o}</option>
        )
    }

    render(){
        return (
            <div className="form-group mb-3">
                {this.renderUsers()}
                <div className="row">
                    <div className="col-6">
                        <div className="input-group">
                            <Autocomplete
                                getItemValue={(item) => item.profile.email}
                                shouldItemRender={(item, value) => item.profile.email.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                items={this.props.users}
                                renderItem={(item, isHighlighted) =>
                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                        {item.profile.email}
                                    </div>
                                }
                                value={this.state.userEmail}
                                onChange={(e) => this.setState({userEmail: e.target.value})}
                                onSelect={(val) => this.setState({userEmail: val})}
                                wrapperStyle={{'display': 'inline-block', 'width': '100%'}}
                                menuStyle={{left: 'auto', top: 'auto', position: 'fixed'}}
                                inputProps={{
                                    'placeholder': 'User',
                                    'class': 'form-control w-100'
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-3" style={{paddingTop: "11px"}}>
                        <select 
                            className="mb-3" 
                            valus={this.state.userRole} 
                            onChange={(e) => this.setState({userRole: e.target.value})}
                        >
                            {this.renderRoleOptions()}
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

const mapStateToProps = state => ({
    users: state.users
});

export default connect(mapStateToProps)(AddUserInput);