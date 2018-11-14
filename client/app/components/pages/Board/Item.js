import React, { Component } from 'react';
import asteroid from '../../../common/asteroid';

 
// App component - represents the whole app
export default class Item extends Component {

    constructor(props){
        super(props)

        this.state = {
            itemChecked: this.props.item.itemChecked
        }
    }

    handleToggleCheck(e){
        let itemChecked = e.target.checked;
        let itemId = this.props.item._id;
        this.setState({itemChecked: itemChecked}, () => {
            asteroid.call("checklists.setItemChecked", itemId, itemChecked)
        });
    }

    handleRemoveItem(){
        asteroid.call("checklists.removeItem", this.props.item._id);
    }

    render() {
        return(
            <div className="custom-control custom-checkbox">
                <input 
                    className="custom-control-input" 
                    id={"check"+this.props.item._id} 
                    type="checkbox"
                    checked={this.state.itemChecked}
                    onChange={(e) => this.handleToggleCheck(e)}
                />
                <label className="custom-control-label" htmlFor={"check"+this.props.item._id}>{this.props.item.itemName}</label>
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