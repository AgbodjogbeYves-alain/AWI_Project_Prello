import React, { Component } from 'react';
import { connect } from 'react-redux';
import asteroid from '../../../common/asteroid';

class CheckListDropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checklistName: ""
        }
    }

    handleCreateChecklist(e){
        e.preventDefault();
        let that = this;
        let checklistName = this.state.checklistName
        asteroid.call("checklists.addChecklist",this.props.cardId, checklistName)
        .then(() => {
            that.setState({checklistName: checklistName})
        })
    }

    render(){
        return (
            <div>
                <div className="card card-stats mb-4 mb-lg-0 cardForOptions">
                    <div className="card-body" style={{width: "max-content"}}>
                        <h5>New checklist</h5>
                        <form role="form" onSubmit={(e) => this.handleCreateChecklist(e)}>
                            <div className="form-group mb-3">
                                <div className="input-group input-group-alternative">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="ni ni-bullet-list-67"></i></span>
                                    </div>
                                    <input 
                                        className="form-control" 
                                        placeholder="Checklist name" 
                                        type="text"
                                        required
                                        value={this.state.checklistName}
                                        onChange={(e) => this.setState({checklistName: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <button 
                                    className="btn btn-primary my-4"
                                    type="submit"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }


}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(CheckListDropdown);



