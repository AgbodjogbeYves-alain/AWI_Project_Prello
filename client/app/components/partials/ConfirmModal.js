import React, { Component } from 'react';

export default class ConfirmModal extends Component {
    render(){
        return ( 
            <div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true">
                <div className="modal-dialog modal- modal-dialog-centered modal-" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h6 className="modal-title" id="modal-title-default">Action confirmation</h6>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <p>{this.props.text}</p>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-link" data-dismiss="modal">Close</button>
                            <button 
                                className="btn btn-warning  ml-auto" 
                                data-dismiss="modal"
                                onClick={this.props.confirmAction}>
                                Confirm
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}