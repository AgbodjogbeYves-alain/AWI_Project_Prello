import React, { Component } from 'react';
import { setRefreshed } from '../../actions/RefreshActions';
import { connect } from 'react-redux';
 
// App component - represents the whole app
class LoadingPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pourcent: 0
        }

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount(){
        this.increasePourcent()
    }

    increasePourcent(){
        if(this.state.pourcent < 100){
            setTimeout(() =>{
                this.setState({
                    pourcent: this.state.pourcent === 100 ? 0 : this.state.pourcent + 5
                })
                this.increasePourcent()
            }, 100)
        }
        else {
            this.props.dispatchSetRefreshed()
        }
        
    }

    render() {
        return (
            <main id="loading-page">
                <div className="progress-wrapper">
                    <div className="progress-info">
                        <div className="progress-label">
                        <span>Prello</span>
                        </div>
                        <div className="progress-percentage">
                            <span id="pourcent">{this.state.pourcent}%</span>
                        </div>
                    </div>
                    <div className="progress">
                        <div id="progess-bar" className="progress-bar bg-primary" role="progressbar" aria-valuenow={this.state.pourcent} aria-valuemin="0" aria-valuemax="100" 
                            style={{"width": this.state.pourcent + "%"}}></div>
                    </div>
                </div>
            </main>
        );
    }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  dispatchSetRefreshed: () => dispatch(setRefreshed())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingPage);
