import React, { Component } from 'react';
import asteroid from '../../../common/asteroid';
import { connect } from 'react-redux';
import { callSetItemChecked } from '../../../actions/ChecklistActions';


// App component - represents the whole app
class Item extends Component {

    constructor(props){
        super(props)

        this.state = {
            itemChecked: this.props.item.itemChecked
        }
    }

    handleToggleCheck(e){
        let itemChecked = e.target.checked;
        let itemId = this.props.item._id;
        this.setState({itemChecked: itemChecked});
        this.props.dispatchCallSetItemChecked(itemId, itemChecked);
    }

    handleRemoveItem(){
        asteroid.call("checklists.removeItem", this.props.item._id);
    }

    componentWillReceiveProps(nextProps){
        this.setState({itemChecked: nextProps.item.itemChecked});
    }

    render() {
        let item = this.props.item;
        return(
            <div className="custom-control custom-checkbox">
                <input
                    className="custom-control-input"
                    id={"check"+item._id}
                    type="checkbox"
                    checked={this.state.itemChecked}
                    onChange={(e) => this.handleToggleCheck(e)}
                />
                <label className={"custom-control-label " + (item.itemChecked ? " checked" : "") } htmlFor={"check"+item._id}>
                    {this.props.item.itemName}
                </label>
                <button
                    className="btn btn-secondary btn-sm float-right"
                    onClick={() => this.handleRemoveItem()}
                >
                    <i class="ni ni-fat-remove"></i>
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => ({
    dispatchCallSetItemChecked: (itemId, itemChecked) => dispatch(callSetItemChecked(itemId, itemChecked)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Item);