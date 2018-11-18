import React, { Component } from 'react';
import { connect } from 'react-redux';
import asteroid from '../../../common/asteroid';
import Item from './Item';
import { callRemoveChecklist } from '../../../actions/ChecklistActions';


// App component - represents the whole app
class Checklist extends Component {

    constructor(props){
        super(props)

        this.state = {
            newItemName: ""
        }
    }

    handleRemoveChecklist(){
        const checklist = this.props.checklists.find((checklist) => checklist._id === this.props.checklistId);
        if(confirm("Are you sure to remove ?")) this.props.dispatchRemoveChecklist(checklist._id)
    }

    renderItems(){
        const checklist = this.props.checklists.find((checklist) => checklist._id === this.props.checklistId);
        return checklist.checklistItems.map((item,i) =>
            <li key={i}><Item item={item}/></li>
        )
    }

    handleAddItem(e){
        const checklist = this.props.checklists.find((checklist) => checklist._id === this.props.checklistId);

        const that = this;
        if(e.key === "Enter" && this.state.newItemName !== ""){
            asteroid.call("checklists.addItem", checklist._id, this.state.newItemName)
            .then(() => that.setState({newItemName: ""})).catch((error) => {alert(error.reason)})

        }
    }

    getCompletedPourcent(){
        const checklist = this.props.checklists.find((checklist) => checklist._id === this.props.checklistId);

        let totalItems = checklist.checklistItems.length;
        if(totalItems == 0) return 100;
        let numCheckedItems = checklist.checklistItems.filter((i) => i.itemChecked).length;
        return 100*numCheckedItems/totalItems;
    }

    render() {
        const checklist = this.props.checklists.find((checklist) => checklist._id === this.props.checklistId);
        return(
            <div className="checklist card">
                <div className="card-body">
                    <h4>
                        <span style={{verticalAlign: "sub"}}><i className="ni ni-bullet-list-67"></i> </span>
                        {checklist.checklistName}
                    </h4>

                    <div className="progress">
                        <div className="progress-bar bg-primary" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
                            style={{"width": this.getCompletedPourcent() + "%"}}>
                        </div>
                    </div>

                    <button
                        className="btn btn-danger btn-sm remove"
                        onClick={() => this.handleRemoveChecklist()}
                    >
                        <i className="ni ni-fat-remove"></i>
                    </button>
                    <ul className="items">
                        {this.renderItems()}
                    </ul>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fa fa-check-square"></i></span>
                        </div>
                            <input
                                className="form-control"
                                placeholder="New item"
                                type="text"
                                value={this.state.newItemName}
                                onChange={(e) => this.setState({newItemName: e.target.value})}
                                onKeyPress={(e) => this.handleAddItem(e)}
                            />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    checklists : state.checklists
});

const mapDispatchToProps = dispatch => ({
    dispatchRemoveChecklist: (checklistId) => dispatch(callRemoveChecklist(checklistId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checklist);
