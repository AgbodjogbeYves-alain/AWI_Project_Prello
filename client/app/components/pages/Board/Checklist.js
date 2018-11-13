import React, { Component } from 'react';
import { connect } from 'react-redux';
import asteroid from '../../../common/asteroid';

 
// App component - represents the whole app
class Checklist extends Component {

    handleRemoveChecklist(){
        if(confirm("Are you sure to remove ?")) asteroid.call("checklists.removeChecklist", this.props.checklist._id);
    }

    render() {
        return(
            <div className="checklist">
                <h4>
                    <span style={{verticalAlign: "sub"}}><i class="ni ni-bullet-list-67"></i> </span>
                    {this.props.checklist.checklistName}
                </h4>
                <button 
                    className="btn btn-danger btn-sm remove"
                    onClick={() => this.handleRemoveChecklist()}
                >
                    <i class="ni ni-fat-remove"></i>
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(Checklist);