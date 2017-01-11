// dislog.jsx

import React from 'react';
import Flux from './flux';


class WineItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    deleteWine() {
        Flux.dispatch({
            action: 'deleteWine',
            wine: this.props.wine.id,
            party: this.props.party._id
        });
    }
    render() {
        if (this.props.wine.uid === uid) {
            return (
                    <span> 
                        You are bringing a wine - Edit - <a onClick={this.deleteWine.bind(this)}>Delete</a>
                    </span>
           )
        } else {
            return (
                    <span> 
                        {this.props.wine.userName} is bringing a wine.
                    </span>
           )
        }
    }
}

export default WineItem;
