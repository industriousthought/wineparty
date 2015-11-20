// dislog.jsx

import React from 'react';
import Flux from './flux';


class BringWine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            partyDetails: {}
        };
    }
    componentDidMount() {
        Flux.register('bringWinePartyDetailsListener', payload => {
            if (payload.action === 'partydetails') {
                this.setState({partyDetails: {
                    id: payload.id,
                    name: payload.name
                
                }});
                console.log(this);
            }
        });
        Flux.dispatch({
            action: 'getPartyDetails'
        });
    }
    render() {
        return (
            <div className='innerDialog'>
                <h1>Brian a wine to: {this.state.partyDetails.name} </h1>
            </div>

        )
    }
}

export default BringWine;
