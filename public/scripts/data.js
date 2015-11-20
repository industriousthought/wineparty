import Flux from './flux';
import req from './req';

let parties = {};

const populatePartyList = res => {
    parties = JSON.parse(res.responseText);
    for (let key in parties) {
        parties[key] = JSON.parse(parties[key]);
    }
    console.log(parties);
    dispatchParties();
};

const dispatchParties = () => {
    Flux.dispatch({
        action: 'populateInvited',
        list: parties.invited
    });
    Flux.dispatch({
        action: 'populateRSVP',
        list: parties.RSVP
    });
    Flux.dispatch({
        action: 'populateHosting',
        list: parties.hosting
    });

};

Flux.register('bringWineListener', payload => {
    if (payload.action === 'bringWine') {
        let outerPayload = payload;
        Flux.dispatch({
            action: 'opendialog',
            dialogName: 'bringwine'
        });
        Flux.register('getPartyDetails', payload => {
            if (payload.action === 'getPartyDetails') {
                Flux.dispatch({
                    action: 'partydetails',
                    id: outerPayload.id,
                    name: outerPayload.name
                });
                Flux.register('getPartyDetails', () => {});
            }
        });
    }
});

Flux.register('dispatchPartiesListener', payload => {
    if (payload.action === 'dispatchParties') {
        dispatchParties();
    }
});

Flux.register('RSVPToParty', payload => {
    if (payload.action === 'RSVPToParty') {
        const RSVP = res => {
            if (JSON.parse(res.responseText).status === true) {
                let index, party;
                parties.invited.forEach((item, i) => {
                    if (item._id === payload.id) index = i;
                });
                party = parties.invited.splice(index, 1);
                parties.RSVP.push(party);
                Flux.dispatch({
                    action: 'populateInvited',
                    list: parties.invited
                });
                Flux.dispatch({
                    action: 'populateRSVP',
                    list: parties.RSVP
                });
            }
        };
        req('/parties/invited/' + payload.id, RSVP, 'POST');
    }
});

Flux.register('deleteParty', payload => {
    if (payload.action === 'deleteParty') {
        const deletePartyItem = res => {
            if (JSON.parse(res.responseText).status === true) {
                let index;
                parties.hosting.forEach((item, i) => {
                    if (item._id === payload.id) index = i;
                });
                parties.hosting.splice(index, 1);
                Flux.dispatch({
                    action: 'populateHosting',
                    list: parties.hosting
                });
            } else {
                console.log('failed to delete');
            }
        };
        req('/parties/delete/' + payload.id, deletePartyItem, 'POST');
    }
});

req('/parties/', populatePartyList, 'GET');
