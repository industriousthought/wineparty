// alerts.jsx

import React from 'react';
import AlertItem from './alertitem';
import Flux from './flux';

class Alerts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {alerts: []};
        Flux.register('invitedAlertListener', payload => {
            if (payload.action === 'populateInvited'){
                console.log('alerts flux triger');
                this.setState({alerts: payload.list});
            }
        });
    }
    render() {
        return (
            <ul> 
                {(alerts => {
                    if (alerts) return alerts.map(item => {
                        return <AlertItem type={item.type} name={item.name} />

                    });

                })(this.state.alerts)}
            </ul>
        )
    }
}
export default Alerts;
