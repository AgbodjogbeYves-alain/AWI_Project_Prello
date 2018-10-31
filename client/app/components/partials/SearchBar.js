import React, { Component } from 'react'

export class SearchBar extends Component {
    state = {
        query: '',
    }

    handleInputChange = () => {
        this.setState({
            query: this.search.value
        })
    }

    render() {
        return (
            <div className="col-md-6" id="searchBar">
                <div className="form-group">
                    <div className="input-group mb-4">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="ni ni-zoom-split-in"></i></span>
                        </div>
                        <input className="form-control" placeholder="Search" type="text" onChange={this.handleInputChange}/>
                    </div>
                </div>
            </div>
        )
    }
}

