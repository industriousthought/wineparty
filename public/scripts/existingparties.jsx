// dislog.jsx

import React from 'react';
import WineItem from './wineitem';
import Flux from './flux';
import req from './req';
import Data from './data';


class ExistingParties extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hostingList: [],
            RSVPList: [],
            invitedList: [],
            ongoing: []
        };
    }
    componentDidMount() {
        const updateState = () => {
            const parties = Data();
            this.setState({
                hostingList: parties.hosting, 
                RSVPList: parties.RSVP,
                invitedList: parties.invited,
                ongoing: parties.ongoing
            });
        };
        Flux.register('exisitingPartiesDialogListener', payload => {
            if (payload.action === 'populateParties'){
                updateState();
            }
        });
        updateState();
    }
    startParty(id) {
        Flux.dispatch({
            action: 'startparty',
            id: id
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
                {(() => {
                    if (this.state.ongoing.length > 0) return (
                        <div>
                            <h2>Ongoing Parties</h2>
                            <ul>
                                {(() => {
                                    return this.state.ongoing.map(party => {
                                        return (<li> 
                                            <br /> {party.location} 
                                            <br /> {party.dateTime} 
                                        </li>)
                                    });
                                })()}
                            </ul>
                        </div>
                    )
                })()}
                <h2> Parites You're Hosting </h2>
                <ul>
                    {(() => {
                        return this.state.hostingList.map(party => {
                            return (<li> 
                                <br /> {party.location} 
                                <br /> {party.dateTime} 
                                <br /> <a onClick={ () => { this.deleteParty(party._id); } }> Delete </a>
                                <br /> <a onClick={ () => { this.addWine(party._id, party.location); } }> Register a wine </a>
                                <br /> <a onClick={ () => { this.startParty(party._id); } }> Start this party </a>
                                <br /> 
                                {(() => {
                                    return party.wines.map(wine => {
                                        return <WineItem party={party} wine={wine} />
                                    });
                                })()}
                            </li>);
                        });
                    })()}
                </ul>
                <h2> Others' Parites You're Attending </h2>
                <ul>
                    {(() => {
                        return this.state.RSVPList.map(party => {
                            return (<li> 
                                <br /> {party.location} 
                                <br /> {party.dateTime} 
                                <br /> <a onClick={ () => { this.addWine(party._id, party.location); } }> Register a wine </a>
                                <br /> 
                                {(() => {
                                    return party.wines.map(wine => {
                                        return <WineItem party={party} wine={wine} />
                                    });
                                })()}
                            </li>);
                        });
                    })()}

                </ul>
                <h2> Parites You're Invited To</h2>
                <ul>
                    {(() => {
                        return this.state.invitedList.map(party => {
                            return (<li> 
                                <br /> {party.location} 
                                <br /> {party.dateTime} 
                                <br /> <a onClick={ () => { this.RSVP(party._id); } }> RSVP </a>
                                </li>);
                        });
                    })()}

                </ul>
            </div>

        )
    }
}

export default ExistingParties;
