import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { connect } from 'react-redux';

class AddUserInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addedUsers: this.props.addedUsers,
            userEmail: "",
            userRole: 'user',
            users: [],
            alerts: []
        };
    }

    renderUsers(){
        return this.props.addedUsers.map((addedUser,i) => {
            let user = this.props.users.filter((u) => u._id === addedUser.userId)[0];
            if(addedUser.userId === this.props.user._id) user = this.props.user;
            if(!user) return ""
            
            return (
                <div className="row" key={i}>
                    <div className="col-7">
                        {user.profile.email}
                    </div>
                    <div className="col-3">
                        <select 
                            className="mb-3" 
                            value={addedUser.role} 
                            onChange={(e) => this.handleChangeUserRole(user._id, e.target.value)}
                        >
                            {this.renderRoleOptions()}
                        </select>
                    </div>
                    {user._id != this.props.user._id ?
                    <div className="col-2">
                        <button className="btn btn-danger btn-sm" onClick={() => this.handleRemoveUser(user._id)}>
                            x
                        </button>
                    </div> : ""}
                </div>
            )
        })
    }

    handleRemoveUser(userId){
        let newAddedUsers = this.state.addedUsers.filter((u) => u.userId != userId);
        this.setState({addedUsers: newAddedUsers}, function(){
            this.onChange();
        });
        
    }

    handleAddUser(){
        let addedUsers = this.props.addedUsers;
        let user = this.props.users.filter((u) => u.profile.email === this.state.userEmail)[0];
        let alreadyUser = addedUsers.filter((u) => u.userId == user._id);
        if(alreadyUser.length > 0) alert("This user has been already put.")
        else if(user){
            addedUsers.push({
                userId: user._id,
                role: this.state.userRole
            })
            
            this.setState({addedUsers: addedUsers});
            this.setState({userEmail: ''});
            this.onChange();
        }    
        else this.addAlert("danger", "No user with this email.");
    }

    onChange(){
        this.props.onChange('addedUsers', this.state.addedUsers);
    }

    handleChangeUserRole(userId, userRole){
        let newAddedUsers = this.props.addedUsers.map((u) => {
            if(u.userId == userId){
                u.role = userRole
            } 
            return u
        })

        this.setState({addedUsers: newAddedUsers}, function(){
            this.onChange();
        });
        
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
    users: state.users,
    user: state.user
});

export default connect(mapStateToProps)(AddUserInput);