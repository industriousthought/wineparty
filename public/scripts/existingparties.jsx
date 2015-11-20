// dislog.jsx

import React from 'react';
import Flux from './flux';
import req from './req';


class ExistingParties extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hostingList: [],
            RSVPList: [],
            invitedList: []
        };
    }
    componentDidMount() {
        Flux.register('hostingDialogListener', payload => {
            if (payload.action === 'populateHosting'){
                this.setState({hostingList: payload.list});
            }
        });
        Flux.register('RSVPDialogListener', payload => {
            if (payload.action === 'populateRSVP'){
                this.setState({RSVPList: payload.list});
            }
        });
        Flux.register('invitedDialogListener', payload => {
            if (payload.action === 'populateInvited'){
                this.setState({invitedList: payload.list});
            }
        });
        Flux.dispatch({
            action: 'dispatchParties'
        });
    }
    addWine(id, name) {
        Flux.dispatch({
            action: 'bringWine',
            id: id,
            name: name
        });
    }
    RSVP(id) {
        Flux.dispatch({
            action: 'RSVPToParty',
            id: id
        });
    }
    deleteParty(id) {
        Flux.dispatch({
            action: 'deleteParty',
            id: id
        });
    }
    render() {
        return (
            <div className="innerDialog">
                <h2> Parites You're Hosting </h2>
                <ul>
                    {(() => {
                        return this.state.hostingList.map(item => {
                            return (<li> 
                                <br /> {item.location} 
                                <br /> {item.dateTime} 
                                <br /> <a onClick={ () => { this.deleteParty(item._id); } }> Delete </a>
                                <br /> <a onClick={ () => { this.addWine(item._id, item.location); } }> Register a wine </a>
                                </li>);
                        });
                    })()}
                </ul>
                <h2> Others' Parites You're Attending </h2>
                <ul>
                    {(() => {
                        return this.state.RSVPList.map(item => {
                            return (<li> 
                                <br /> {item.location} 
                                <br /> {item.dateTime} 
                                <br /> <a onClick={ () => { this.addWine(item._id, item.location); } }> Register a wine </a>
                                </li>);
                        });
                    })()}

                </ul>
                <h2> Parites You're Invited To</h2>
                <ul>
                    {(() => {
                        return this.state.invitedList.map(item => {
                            return (<li> 
                                <br /> {item.location} 
                                <br /> {item.dateTime} 
                                <br /> <a onClick={ () => { this.RSVP(item._id); } }> RSVP </a>
                                </li>);
                        });
                    })()}

                </ul>
            </div>

        )
    }
}

export default ExistingParties;
